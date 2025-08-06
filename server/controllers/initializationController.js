// Split cards from sheets
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tesseract, { createWorker } from 'tesseract.js';
import levenshtein from 'fast-levenshtein';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = await Promise.all([fs.promises.readFile(path.join(__dirname,'../assets/cards-csv.json'), 'utf-8'),]);
const db = JSON.parse(data)

const suits = [
  "STRENGTH",
  "GRACE",
  "INTELECT"
]

const traitType = [
  "TALENT",
  "COMBAT STYLE"
]

const anatomy = {
  Value: {area: {top:20,left:25,width:80,height:100}, params: {tessedit_pageseg_mode: '8', user_defined_dpi: '96', tessedit_char_whitelist: '1234567890 '}},
  Type: {area: {top:35,left:20,width:500,height:80}, params: {tessedit_pageseg_mode: '7', user_defined_dpi: '96', tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&'\" "}},
  Title: {area: {top:125,left:5,width:540,height:60}, params: {tessedit_pageseg_mode: '3', user_defined_dpi: '96', tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&'\" "}},
  Name: {area: {top:600,left:0,width:550,height:60}, params: {tessedit_pageseg_mode: '7', user_defined_dpi: '96', tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&'\" "}},
  Rank: {area: {top:830,left:200,width:150,height:90}, params: {tessedit_pageseg_mode: '7', user_defined_dpi: '96', tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&'\" "}},
  Toughness: {area: {top:810,left:410,width:120,height:120}, params: {tessedit_pageseg_mode: '8', user_defined_dpi: '96',tessedit_char_whitelist: '1234567890 '}},
}

const classes = [
  'DEVOTED',
  'DURANTS',
  'ELEMENTAL',
  'FORCEFUL',
  'SHROUDED',
  'BITTER',
]

function getClosestMatch(input, targets) {
  let bestMatch = null;
  let lowestDistance = Infinity;

  for (const target of targets) {
    const distance = levenshtein.get(input.toLowerCase(), target.toLowerCase());
    if (distance < lowestDistance) {
      lowestDistance = distance;
      bestMatch = target;
    }
  }
  return {bestMatch, lowestDistance};
}

function getBestMatch(db,card){
//create targets
  let set = []
  for (let index in db){
      if (db[index].name.includes('/')){
        let split = db[index].name.split('/');
        for (let x in split){
          set.push(split[x])
        }
      }else{
        set.push(db[index].name)
      }
      
  }
      let {bestMatch, lowestDistance} = getClosestMatch(card,set);
      let summary = `${card} : ${bestMatch} | ${lowestDistance}`;
      return {bestMatch, lowestDistance,summary}
}

async function splitCards(sheetName, imgPath, outputDir, rows, columns) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  const promises = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const image = sharp(imgPath);
      const metadata = await image.metadata();
      const cardWidth = Math.floor(metadata.width / columns);
      const cardHeight = Math.floor(metadata.height / rows);
      const left = col * cardWidth;
      const top = row * cardHeight;
      const width = (col === columns -1) ? metadata.width - left : cardWidth;
      const height = (row === rows - 1) ? metadata.height - top : cardHeight;

      const outputFile = path.join(outputDir, `/${sheetName}_card_${row}_${col}.jpg`);
      const card = image.extract({ left, top, width: width, height: height }).jpeg({quality: 90});
      promises.push(card.toFile(outputFile).catch(err => {
        console.error(`Error writing to ${outputFile}`,err);
        //console.log(left, top, cardWidth, cardHeight);
      }));
    }
  }
  await Promise.all(promises);
  //console.log(`Cards from ${sheetName} have been saved!`);
}

async function createCards(inputDir, outputDir, rows, columns){
  const files = fs.readdirSync(inputDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file))
  for (const file of files){
    const filePath = path.join(inputDir,file);
    const basename = path.parse(file).name;
    await(splitCards(basename, filePath, outputDir, rows, columns))
  }
  //console.log('All Sheets Processed')
}

function getBrightness(area, scan){
  const pixelCount = area.width * area.height;
  const totalBrightness = scan.reduce((sum, val) => sum + val, 0);
  const avgBrightness = totalBrightness / pixelCount;
  return avgBrightness
}

async function getRegion(buffer,key,worker){
  // get slice of area
  let slice = await sharp(buffer)
    .extract(anatomy[key].area)
    .greyscale()
    .threshold(130);
  // Check if image is black on white or white on black
  const scan = await sharp(buffer).extract(anatomy[key].area)
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer();
  const avgBrightness = getBrightness(anatomy[key].area,scan);
  if (avgBrightness < 100){
    slice.negate();
  }
  // save file of this slice for testing purposes
  await slice.jpeg().toFile(`${key}_test.jpg`);
  slice = await slice.toBuffer();
  // set parameters for this part of the card
  await worker.setParameters(anatomy[key].params);
  // get data from card
  const {data} = await worker.recognize(slice);
  return data;

}

async function identifyCard(imgPath){
  const buffer = fs.readFileSync(imgPath);
  if (getBrightness({width:550,height:950},await sharp(buffer).removeAlpha().greyscale().raw().toBuffer()) === 0){
    //console.log(`${imgPath} is blank`)
    return 'Blank'
  }

  const worker = await Tesseract.createWorker('eng');
  let card = new Map();
  for (const [key, value] of Object.entries(anatomy)) {
    //console.log(key)
    const data = await getRegion(buffer,key,worker);
    card.set(key,data.text.trim());
  };
  await worker.terminate();
  console.log(card);
  let cardType = ''
  let out 
  // logic
  if (!!card.get('Value')&&!traitType.some(type => card.get('Type').includes(type))){
    //is action
    cardType ='Action';
    let {bestMatch,lowestDistance,summary} = getBestMatch(db,card.get('Name'))
    console.log(lowestDistance)
    if (lowestDistance>6 || card.get('Name') ==''){
      out = {name:`${card.get('Value')} ${suits.find(suit => card.get('Type').includes(suit))}`,path:imgPath,sum:summary}
    }
    out = {name:bestMatch,path:imgPath,sum:summary}
  }else if (!!card.get('Toughness')){
    // is monster(back)
    cardType ='Monster(Back)';
    let {bestMatch,lowestDistance,summary} = getBestMatch(db,card.get('Type'))
    out = {name:`${bestMatch}(Back)`,path:imgPath,sum:summary}
  }else if (card.get('Rank').includes('Rank') || card.get('Rank').includes('Core')){
    // is trait
    cardType ='Trait';
    let {bestMatch,lowestDistance,summary} = getBestMatch(db,card.get('Title'))
    out = {name:bestMatch,path:imgPath,sum:summary}
  }else if (card.get('Type') == 'Talon'){
    // is talon
    cardType ='Talon';
    let {bestMatch,lowestDistance,summary} = getBestMatch(db,card.get('Title'))
    out = {name:bestMatch,path:imgPath,sum:summary}
  }else if (classes.some(word => card.get('Type').includes(word))){
    const school = classes.find(word => card.get('Type').includes(word))
    if (card.get('Rank').match(/\d/)!==null){
      // is class(back)
      cardType =`${school}(Back)`;
      out = {name:`${school}(Back)`,path:imgPath,sum:'none'}
    }else{
      //is class(front)
      cardType =`${school}(Front)`;
      out = {name:`${school}(Front)`,path:imgPath,sum:'none'}
    }
  }else if(!!card.get('Type')){
    //is monster(front)
    cardType ='Monster(Front)';
    let {bestMatch,lowestDistance,summary} = getBestMatch(db,card.get('Type'))
    out = {name:`${bestMatch}(Front)`,path:imgPath,sum:summary}
  }else{
      //is Card(back)
      cardType ='Cardback'
      out = {name:'Cardback',path:imgPath,sum:"none"}
  }
  console.log(cardType)
  return out
}

async function createCardMap(inputDir){
  const files = fs.readdirSync(inputDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  let cards = new Map();
  for (const file of files){
    const filePath = path.join(inputDir,file);
    let card = await(identifyCard(filePath));
    if (cards.has(card.name)){
      cards.set(`${card.name}(Back)`,card.path);
    }else {
      cards.set(card.name,card.path,card.sum);
    }
    
  }
  return Object.fromEntries(cards)
}
export default {
  splitCards,
  createCards,
  identifyCard,
  createCardMap,
}