// Hand.tsx
import {useEffect, useState,useRef} from "react";
import "./hand.css";
import {Card, type CardDataProps, type CardProps,} from './Card';


type HandProps ={
  cards: CardDataProps[];
  onCardClick: (id: number, out?:boolean,name?:string) => void;
}

export function Hand({cards, onCardClick} : HandProps) {
  const [handCards, setCards] = useState<CardProps[]>([])
  const selectedIndex = useRef<any[]>([])
  
const toggleCard = (index: number) => {
  setCards(prevCards =>
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
  console.log(index)
  console.log(selectedIndex.current)
  console.log(index+handCards[index].data._id)
  const key = `${index}${handCards[index].data._id}`
  console.log(key)
  if(selectedIndex.current.includes(key)){
    console.log('is in')
    const remove = selectedIndex.current.findIndex(item => item === key);
        if (remove !== -1) {
        selectedIndex.current.splice(remove, 1);
        }
    onCardClick(index,true,handCards[index].data._id)
    
  }else{
    console.log('not in')
    onCardClick(index)
    selectedIndex.current.push(key)
  }
};
const setHover = (index: number, value: boolean) => {
  setCards(prevCards =>
    prevCards.map((card, i) =>
      i === index
        ? {
            ...card,
            display: {
              ...card.display,
              hover: value,
            },
          }
        : card
    )
  );
};
const showHand = () => {
  return handCards.map((card, index) => {
    const offset = (index - 2) * 70;
    const className=`card-wrapper ${card.display.selected ? "selected" : ""} ${card.display.hover ? "hovered" : ""}`;

    return (
      <div
        key={index}
        onClick={() => toggleCard(index)}
        className={className}
        style={{ transform: `translateX(${offset}px)`}}
        onMouseEnter={() => setHover(index, true)}
        onMouseLeave={() => setHover(index, false)}
      >
        <Card data={card.data} display={card.display} />
      </div>
    );
  });
};
  useEffect(()=>{
      let displaycards = cards.map((card,index) =>
        ({ data: card,
          display:{
            index: index,
            selected: false,
            onClick: () => toggleCard(index),
            hover: false
          }
        })
      )
      console.log(displaycards)
      setCards(displaycards)
    },[cards])

  return (
    <div className="hand-wrapper">
      {showHand()}
    </div>
  );
}
