import { useState, useEffect, useRef } from 'react'
import './App.css'
import OBR from '@owlbear-rodeo/sdk'
import { useDatabase } from './hooks/useDatabase'

//hook imports
import {useOBRMetadata, isMetadata, setOBRMetadata, type metadata} from './hooks/useOBRMetadata'

//component imports
import { Hand, type handRef } from './components/Hand'
import {type CardProps,type CardDataProps, isCardDataProps,isCardDisplayProps,isCardProps} from './components/Card'
import {Spread, type SpreadProps} from './components/Spread'
import {Valuecomponent} from './components/Valuecomponent'
const appId = "com.my-extension.phoenix/metadata";


function App() {
  //subscribe to the room metadata
  const {metadata,startup,displayMetadata} = useOBRMetadata()
  const player = useRef('')
  const deckRef = useRef<{ hand: any[]; draw: any[]; discard: any[] }>({ hand: [], draw: [], discard: [] });
  const spreadRef = useRef<{owner:string,cards:any[],assist:{[key: string]: any[];}}>({owner:'',cards:[],assist:{}})
  const handRenderRef = useRef<(string|CardProps|null)[]> ([''])

  //initialization Checkers
  const gameInit = useRef(false);
  const metadataInit = useRef(false);
  const playerInit = useRef(false);

  // display States
  const [hand, setHand] = useState<CardProps[]>([]);
  const [spread, setSpread] = useState<SpreadProps>({owner:'',assist:{},cards:[]});
  const [actionHeight, setHeightState] = useState<number>(0);
  const [actionWidth, setWidthState] = useState<number>(0);
  const [displayValue, setSpreadValue] = useState<number>(0);
  const [handResetTrigger, triggerReset] =useState<boolean>(false);
  

  // init functions
  const Init = async () => {
      let leave = OBR.onReady( async ()=>{
        await startMetadata()
        await createGame();
        await playerJoin();
        await getDeck();
      })
  }
  const getDeck = async () =>{
    let deck:Response = await useDatabase.getPlayerDeck(player.current)
    if(deck.ok){
      let deckJson:any = await deck.json()
      deckRef.current = deckJson
    }
    console.log('deck init',deckRef.current)
    handRenderRef.current = deckRef.current.hand
    await renderCards()
    for(let index in handRenderRef.current)
    if(isCardProps(handRenderRef.current[index])){
      hand.push(handRenderRef.current[index])
    }
  }
  const playerJoin = async () => {
    let playerId = await OBR.player.getId()
    console.log(playerId)
    let checkPlayer = await useDatabase.getPlayer(playerId+metadata.current.id)
      if (!(checkPlayer.ok)){
        let newPlayer = await useDatabase.newPlayer({'owlID':playerId,'gameID':metadata.current.id})
        if (newPlayer.ok){
          player.current = playerId+metadata.current.id
          let updateList = await useDatabase.updatePlayerList(metadata.current.id,{playerID:player.current})
          if (updateList.ok) playerInit.current=true
        }
      }else{
        player.current = playerId+metadata.current.id
        let updateList = await useDatabase.updatePlayerList(metadata.current.id,{playerID:player.current})
        if (updateList.ok) playerInit.current=true
      }
      console.log('player init')
  }
  const startMetadata = async ()=>{
    await startup()
    metadataInit.current=true
    spreadRef.current=metadata.current.spread
    console.log('Metadata init')
  }
  const createGame = async () =>{
    try {
        if(metadata.current.id == ''){
          console.log(`createing game`)
          let newGame:any = await useDatabase.newGame()
          if(newGame.ok){
            let changes = metadata.current
            changes.id = (await newGame.json())._id
            await setOBRMetadata({changes:changes});
            gameInit.current=true
          }
          
        }else{
          let checkGame = await useDatabase.getGame(metadata.current.id)
          if (!(checkGame.ok)){
            let newGame:any = await useDatabase.newGame()
            if(newGame.ok){
              let changes = metadata.current
              changes.id = (await newGame.json())._id
              await setOBRMetadata({changes:changes});
              gameInit.current=true
            }
          }
          gameInit.current=true
          console.log('game init')
        }
    } catch (err:any) {
      console.error(`Failed to initialize room: ${err}`)
    }
    
  }

// rendering functins
  const renderCards = async () =>{
    for (let index in handRenderRef.current){
      if (typeof handRenderRef.current[index] == 'string'){
        let card = handRenderRef.current[index]
        let cardData:Response = await useDatabase.getCard(card)
        let display = {
              index: index,
              selected: false,
              hover: false
            }
      
      if(cardData.ok){ 
        let jsonCardData = await cardData.json()
        if (isCardDataProps(jsonCardData) && isCardDisplayProps(display)){
          jsonCardData.face = '/cards/'+jsonCardData.face
          jsonCardData.back = '/cards/'+jsonCardData.back
          let newCard = {
          data:jsonCardData,
          display
          }
        handRenderRef.current[index] = newCard
        } 
      }
    }
  }
}
  const toggleCard = (index: number) => {
  setHand(prevCards =>
    prevCards.map((card, i) =>
      i === index
        ? {
            ...card,
            display: {
              ...card.display,
              selected: !card.display.selected,
            },
          }
        : card
    )
  );
    if (hand[index].display.selected){
      console.log('out')
      changeSreadOnClick(index,true,hand[index].data._id)
      
    }else{
      console.log('in')
      changeSreadOnClick(index)

    }
  }

// gameplay functions
  const discard = async (index:number) =>{
    handRenderRef.current = hand
    deckRef.current.discard.push(deckRef.current.hand[index])
    deckRef.current.hand.splice(index,1)
    handRenderRef.current = handRenderRef.current.map((item,i)=>
      i === index ? '' : item
    )
  }
  const draw = async () =>{
    if (deckRef.current.draw.length == 0){
        deckRef.current.draw = deckRef.current.discard
        deckRef.current.discard = []
      }
      handRenderRef.current = hand
      let randomIndex = Math.floor(Math.random() * deckRef.current.draw.length);
      deckRef.current.hand.push(deckRef.current.draw[randomIndex])
      let replace = false
      for(let each in handRenderRef.current){
        if (typeof handRenderRef.current[each] == 'string'){
          handRenderRef.current[each] = deckRef.current.draw[randomIndex]
          replace = true
        }
      } if (!replace){
        handRenderRef.current.push(deckRef.current.draw[randomIndex])
      }
      deckRef.current.draw.splice(randomIndex, 1)
  }
  const discardSelected = async () => {
    for (let i = hand.length - 1; i >= 0; i--) {
      console.log(i)
      console.log(hand[i])
      const card = hand[i];
      if (card.display.selected) {
        toggleCard(i)
        discard(i);
      }
    }
    updateDeck();
  };
  const drawCards = async (cards:number = 5) =>{
    do{draw()
      cards = cards-1
    }while(cards >0)
    updateDeck()
  }
  const changeSreadOnClick = async (index:number,out:boolean=false,name?:string) =>{
    spreadRef.current=metadata.current.spread
    let outSpread:SpreadProps=spreadRef.current
    if(!out){
      if (outSpread.owner == ''){
        outSpread.owner = player.current
        outSpread.cards.push(hand[index])
        spreadRef.current = outSpread
        setSpread(spreadRef.current)
      }else if(outSpread.owner == player.current){
        outSpread.cards.push(hand[index])
        spreadRef.current=outSpread
        setSpread(spreadRef.current)
      }else if(spreadRef.current.owner != player.current){
        if (player.current in outSpread.assist){
          outSpread.assist[player.current].push(hand[index])
        }else{
          outSpread.assist[player.current] = [hand[index]]
        }
      spreadRef.current=outSpread
      setSpread(spreadRef.current)
      }
    }else{
      if (outSpread.owner == ''){
        return //not sure what to do here
      }else if(outSpread.owner == player.current){
        const index = outSpread.cards.findIndex(item => item.data._id === name);
        if (index !== -1) {
          outSpread.cards.splice(index, 1);
        }
      }else if(spreadRef.current.owner != player.current){
        if (player.current in outSpread.assist){
          const index = outSpread.assist[player.current].findIndex(item => item.data._id === name);
          if (index !== -1) {
            outSpread.assist[player.current].splice(index, 1);
          }
        }else{
          return
        }
      }
    }
    let changes = metadata.current
    changes.spread = {owner:spreadRef.current.owner,cards:spreadRef.current.cards,assist:spreadRef.current.assist}
    setOBRMetadata({changes:changes})
  }
  const resetSpread = async () =>{
    let changes = metadata.current
    if (metadata.current.spread.owner == player.current){
      changes.spread = {owner: '', cards: [], assist:{}}
    } else {
      changes.spread = {owner: metadata.current.spread.owner, cards: [], assist:metadata.current.spread.assist}
      changes.spread.assist[player.current] = []
    }
    setOBRMetadata({changes: changes})
    spreadRef.current=metadata.current.spread
    setSpread(changes.spread)
    
    // reset selected
    let newHand:any[] = []
    for(let card of hand){
      card.display.selected=false
      newHand.push(card)
    }
    setHand(newHand)
  }
  const updateDeck= async () =>{
    console.log(deckRef.current.hand)
    await renderCards()
    for (let index in handRenderRef.current){
      if (isCardProps(handRenderRef.current[index])){
        hand.push(handRenderRef.current[index])
      }
    }
    useDatabase.updatePlayerDeck(player.current,deckRef.current)
  }

//run initialization process
  useEffect(() => {
    Init()
  },[]);
  


useEffect(()=>{
  setSpread(metadata.current.spread)
  let val = spread.cards.reduce((acc, card) => {
    return acc + (card.data.value)
  },0)
  for(let each in spread.assist){
  val = val + spread.assist[each].reduce((acc,card)=>{
    return acc + 1},0)
  }
  setSpreadValue(val)
},[displayMetadata])



  return (
   <div className='main-container'>
        <div className='value-container'><Valuecomponent value={displayValue} /></div>
        <div className='spread-container'><Spread owner={spread.owner} cards={spread.cards} assist={spread.assist}/></div>
        <div className='hand-container'> <Hand cards={hand} onCardClick={toggleCard} /> </div>
        <div className='controls-container'><button onClick={() =>drawCards(1)}>draw</button> <button onClick={()=>discardSelected()}> discard</button> <button onClick={resetSpread}>clear</button> </div>
      </div>
  )
}


export default App

