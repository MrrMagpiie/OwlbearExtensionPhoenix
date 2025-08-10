import {useEffect, useState,useRef} from "react";
import "./spread.css";

import {Card, type CardProps, type CardDataProps} from './Card';


export type SpreadProps = {
    owner: string;
    cards:CardProps[];
    assist:{[key: string]: CardProps[];}
}

export function Spread({owner,cards,assist}:SpreadProps) {
    const [spreadCards,setSpread] = useState<CardProps[]>([])
    const [assistCards, setAssist] = useState<CardProps[]>([]) 
    
  useEffect(()=>{
    if (cards){ setSpread(cards)}      
    if (assist){
      let displayAssist:any[] = []
      for (let key in assist){
        for(let card of assist[key]){
          displayAssist.push(card)  
        }}
        setAssist(displayAssist)
      }
    },[cards,assist])

const showAssist = () => {
  if (Array.isArray(setAssist))
  return assistCards.map((card, index) => {
    const offset = (index - 2) * 70;
    return (
      <div
        key={index}
        className='assist-card'
        style={{ transform: `translateX(${offset}px)`}} 
      >
        <Card {...card} />
      </div>
    );
  });
};
const showSpread = () => {
  return spreadCards.map((card, index) => {
    const offset = (index - 2) * 70;
    return (
      <div
        key={index}
        className='spread-card'
        style={{ transform: `translateX(${offset}px)`}}
      >
        <Card {...card} />
      </div>
    );
  });
};

    return (
    <div>
      <div className="assist-wrapper">
          {showAssist()}
      </div>
      <div className="spread-wrapper">
          {showSpread()}
      </div>
    </div>
    )
  
}