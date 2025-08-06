import { useState, useEffect, useRef } from 'react'
import './App.css'
import OBR from '@owlbear-rodeo/sdk'
import { Hand } from './components/Hand'
import {type CardProps,type CardDataProps} from './components/Card'

const appId = "com.my-extension.phoenix/metadata";

const DBCards =[
  {_id : '1',
    type : 'type',
    name : 'name',
    face : '/cards/sheet1_card_0_0.jpg',
    back : '/cards/sheet1_card_0_0.jpg',
    value : 1,
    effect : 'effect',
    school : 'school',
  },
  {_id : '1',
    type : 'type',
    name : 'name',
    face : '/cards/sheet1_card_0_0.jpg',
    back : '/cards/sheet1_card_0_0.jpg',
    value : 1,
    effect : 'effect',
    school : 'school',
  },
  {_id : '1',
    type : 'type',
    name : 'name',
    face : '/cards/sheet1_card_0_0.jpg',
    back : '/cards/sheet1_card_0_0.jpg',
    value : 1,
    effect : 'effect',
    school : 'school',
  },
  {_id : '1',
    type : 'type',
    name : 'name',
    face : '/cards/sheet1_card_0_0.jpg',
    back : '/cards/sheet1_card_0_0.jpg',
    value : 1,
    effect : 'effect',
    school : 'school',
  },
  {_id : '1',
    type : 'type',
    name : 'name',
    face : '/cards/sheet1_card_0_0.jpg',
    back : '/cards/sheet1_card_0_0.jpg',
    value : 1,
    effect : 'effect',
    school : 'school',
  }
]




function App() {
  const [roomId, setRoomId] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const hasInit = useRef(false)
  const [hand, setHand] = useState<CardProps[]>([]);

  const dbCreateGame = async () => {
        console.log('creating new game')
        // create new game in the db
        const createRes = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (createRes.ok) {
          createRes.json().then(responce => {
            OBR.room.setMetadata({[appId]:{'id': responce._id}});
          });
        } else {
          console.error("Failed to create game");
        }
      }
  
  const playerJoin = async () => {
    let playerId = await OBR.player.getId()
    console.log(playerId);
    const res = await fetch(`/api/players/${playerId}`)
        if (res.status === 404){
          //add new player
          let playerdata = {
             owlId : `${playerId}`,
              gameId: `${roomId}`,
          }
          const createRes = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({playerdata})
        });
          if (!createRes.ok) {
            console.log(createRes)
            console.error("Failed to create new player");
            return;
          }
        }
    setPlayer(playerId)

  }

  const initRoom = async () => {
    if (hasInit.current) return;
    hasInit.current = true
    try {
      const roomData = await OBR.room.getMetadata();
      let phoenixData = roomData[appId]
      let newGame = false
      // if the game has no data from extension then create a new game in the db and add its id to the metadata
      if (!phoenixData) newGame = true;
      if (phoenixData && typeof phoenixData === 'object' && 'id' in phoenixData){
        const res = await fetch(`/api/games/${phoenixData.id}`)
        if (res.status === 404){
          newGame = true
        }
      }
      if (newGame) {
        dbCreateGame()
      }
    } catch (error) {
      console.error("Failed to get room metadata:", error);
    }
    const roomData = await OBR.room.getMetadata();
    const phoenixData = roomData[appId];
    if (phoenixData && typeof phoenixData === 'object' && 'id' in phoenixData){
      setRoomId(phoenixData.id)
    }
    setMetadata(phoenixData)
  }

  const dbGetHand = async () =>{
    let cards = DBCards //will be replaced with dbGet
    createHand(cards)
  }

  const createHand = (cards: CardDataProps[]) =>{
    let InitCards = cards.map((card) =>
        ({ data: card,
          display:{}
        })
      )
    setHand(InitCards)
  }

  useEffect(() => {
    OBR.onReady(()=>{
      console.log('OBR is Ready')
      initRoom();
      dbGetHand();
      // nonfunctional currentlly playerJoin(); 
    })
  }, []);

  useEffect(()=>{
    createHand(DBCards)
  },[DBCards])

  return (
    <>
      <div style={{border:`1px solid red`}} ><Hand cards={hand} />
      </div>
    </>
  )
}

export default App
