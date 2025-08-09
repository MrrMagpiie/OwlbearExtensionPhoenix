import { useState, useEffect, useRef } from 'react'
import './App.css'
import OBR from '@owlbear-rodeo/sdk'
import { useDatabase } from './hooks/useDatabase'

//hook imports
import {useOBRMetadata, isMetadata, setOBRMetadata, type metadata} from './hooks/useOBRMetadata'

//component imports
import { Hand } from './components/Hand'
import {type CardProps,type CardDataProps} from './components/Card'
import {Spread, type SpreadProps} from './components/Spread'

const appId = "com.my-extension.phoenix/metadata";

function App() {
  //subscribe to the room metadata
  const {metadata,startup,displayMetadata} = useOBRMetadata()
  const player = useRef('')
  const deckRef = useRef<{ hand: any[]; draw: any[]; discard: any[] }>({ hand: [], draw: [], discard: [] });
  const spreadRef = useRef<{owner:string,cards:any[],assist:{[key: string]: any[];}}>({owner:'',cards:[],assist:{}})


  //initialization Checkers
  const gameInit = useRef(false);
  const metadataInit = useRef(false);
  const playerInit = useRef(false);

  // display States
  const [hand, setHand] = useState<CardDataProps[]>([]);
  const [spread, setSpread] = useState<SpreadProps>({owner:'',assist:{},cards:[]});

  console.log(metadata.current)
  
  const Init = async () => {
      let leave = OBR.onReady( async ()=>{
        await startMetadata()
        await createGame();
        await playerJoin();
        await getDeck();
      })
  }
  const getDeck = async () =>{
    let deck:any = await useDatabase.getPlayerDeck(player.current)
    if(deck.ok) deck = await deck.json()
    deckRef.current = deck
    console.log(deckRef.current)
    let showCards:any[] = await renderCards(deckRef.current.hand)
    setHand(showCards)
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
  }
  const startMetadata = async ()=>{
    await startup()
    metadataInit.current=true
    spreadRef.current=metadata.current.spread
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
        }
    } catch (err:any) {
      console.error(`Failed to initialize room: ${err}`)
    }
  }
  const renderCards = async (cards:any[]) =>{
    let renderedCards:any[] = []
    for (let card of cards){
      let cardData:any = await useDatabase.getCard(card)
      if(cardData.ok){ 
        let jsonCardData = await cardData.json()
        jsonCardData.face = '/cards/'+jsonCardData.face
        jsonCardData.back = '/cards/'+jsonCardData.back
        renderedCards.push(jsonCardData)
      }
    }
    return renderedCards
  }
  const drawCards = async () =>{
      deckRef.current.discard.push(...deckRef.current.hand)
      deckRef.current.hand = []
    do{
      //check if empty
      if (deckRef.current.draw.length == 0){
        deckRef.current.draw = deckRef.current.discard
        deckRef.current.discard = []
      }
      //draw random card 
      let randomIndex = Math.floor(Math.random() * deckRef.current.draw.length);
      deckRef.current.hand.push(deckRef.current.draw[randomIndex])
      deckRef.current.draw.splice(randomIndex, 1)
    }while(deckRef.current.hand.length < 5)
    let showCards:any[] = await renderCards(deckRef.current.hand)
    setHand(showCards)
    await useDatabase.updatePlayerDeck(player.current,deckRef.current)
  }
  const addToSPread = async (index:number,out:boolean=false,name?:string) =>{
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
      const index = outSpread.cards.findIndex(item => item._id === name);
      if (index !== -1) {
      outSpread.cards.splice(index, 1); // removes exactly one item
      }
    }else if(spreadRef.current.owner != player.current){
      if (player.current in outSpread.assist){
        const index = outSpread.assist[player.current].findIndex(item => item._id === name);
        if (index !== -1) {
        outSpread.assist[player.current].splice(index, 1);
        }
      } else{
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
    
    }
  const showSpread = async () =>{
    spreadRef.current=metadata.current.spread
    let spreadShowCards = await renderCards(spreadRef.current.cards)
    let spreadShowAssist:any[] = []
    for(let key in spreadRef.current.assist){
      let outCards = await renderCards(spreadRef.current.assist[key])
      spreadShowAssist.push(outCards)
    }
    let spreadShow:any = {owner:spreadRef.current.owner,cards:spreadShowCards,assists:spreadShowAssist}
  setSpread(spreadShow)
  }

//run initialization process
  useEffect(() => {
    Init()
  },[]);

useEffect(()=>{
  setSpread(metadata.current.spread)
  console.log(`metadata Refresh:${metadata.current.spread}`)
},[displayMetadata])

  return (
    <div className='main-container'>
      <div className='spread-container'><Spread owner={spread.owner} cards={spread.cards} assist={spread.assist}/></div>
      <div className='hand-container'> <Hand cards={hand} onCardClick={addToSPread} /> </div>
      <div className='controls-container'><button onClick={drawCards}>draw</button><button onClick={resetSpread}>clear</button> </div>
    </div>
  )
}


export default App

