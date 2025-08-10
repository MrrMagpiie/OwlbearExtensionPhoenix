// Hand.tsx
import {useEffect, useState,useRef,forwardRef, useImperativeHandle} from "react";
import "./hand.css";
import {Card, type CardDataProps, type CardProps,} from './Card';

export type handRef ={
  reset: () =>void;
}

type HandProps ={
  cards: CardProps[];
  onCardClick: (id: number, out?:boolean,name?:string) => void;
}

export const Hand = forwardRef<handRef, HandProps>(({cards,onCardClick},ref) => {

  const [handCards, setCards] = useState<CardProps[]>([])

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
        onClick={() => onCardClick(index)}
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
      setCards(cards)
    },[cards])


  return (
    <div className="hand-wrapper">
      {showHand()}
    </div>
  );
})
