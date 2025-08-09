import {useEffect, useState,useRef} from "react";
import "./spread.css";

import {Card, type CardProps, type CardDataProps} from './Card';


export type SpreadProps = {
    owner: string;
    cards:CardDataProps[];
    assist:{[key: string]: CardDataProps[];}
}

export function Spread({owner,cards,assist}:SpreadProps) {
    const [spreadCards,setSpread] = useState<CardProps[]>([])
    const [assistCards, setAssist] = useState<CardProps[]>([]) 
    
    useEffect(()=>{
      if (cards){
        let displayCards = cards.map((card) =>
        ({ data: card,
          display:{}
        })
      )
      setSpread(displayCards)
      }
      
      if (assist){
        for (let key in assist){
          let displayAssist = assist[key].map((card) =>
            ({ data: card,
            display:{}
            })
          )
          setAssist(displayAssist)
        }
      }
    },[cards,assist])
   
    return (
    <div>
    <div className="assist-cards">
        {assistCards.map((card, index) => {
        const offset = (index-3)*60;
        return (
          <div
            key={index}
            className="card-wrapper"
            style={{transform:`translateX(${offset}px)`}}
          >
            <Card
            data = {card.data}
            display = {card.display}
            />
          </div>
        );
      })}
    </div>
    <div className="spread-cards">
      {spreadCards.map((card, index) => {
        const offset = (index-3)*60;
        return (
          <div
            key={index}
            className="card-wrapper"
            style={{transform:`translateX(${offset}px)`}}
          >
            <Card
            data = {card.data}
            display = {card.display}
            />
          </div>
        );
      })}
    </div>
    </div>
  );
}