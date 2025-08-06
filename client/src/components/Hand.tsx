// Hand.tsx
import {useEffect, useState} from "react";
import "./hand.css";
import {Card, type CardProps} from './Card';


type HandProps ={
  cards: CardProps[]
}

export function Hand({cards} : HandProps) {
  const [handCards, setCards] = useState<CardProps[]>([])

  const toggleCard = (id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.data._id === id ? { ...card, selected: !card.display.selected } : card
      )
    );
  };
  
  useEffect(()=>{
    setCards(cards)
  },[])

  useEffect(()=>{
    setCards(prev =>
    prev.map(card => ({
      ...card,
      display: {
        ...card.display,
        onClick: () => toggleCard(card.data._id),
      },
    }))
  );
  console.log(handCards)
  },[cards]);

  return (
    <div className="hand-wrapper"
        style={{border:`1px dashed yellow`}}
          >
      {handCards.map((card, index) => {
        console.log(card)
        const offset = (index-3)*60;

        return (
          <div
            key={index}
            className="card-wrapper"
            style={{transform:`translateX(${offset}px)`,border:`1px solid blue`}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translateY(-40px) scale(1.2) translateX(${offset}px)`;
              e.currentTarget.style.transition = `transition: transform 0.2s ease;`;
              e.currentTarget.style.zIndex = "10";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `translateY(0px) scale(1) translateX(${offset}px)`;
              e.currentTarget.style.transition = `transition: transform 0.2s ease;`;
              e.currentTarget.style.zIndex = `${index}`;
            }}
          >
            <Card
            data = {card.data}
            display = {card.display}
            />
          </div>
        );
      })}
    </div>
  );
}
