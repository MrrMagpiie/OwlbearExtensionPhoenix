// Card.tsx
import React from "react";
import "./card.css"; // local styles


  export type CardDataProps = {
    _id : string;
    type : string;
    name : string;
    face : string;
    back : string;
    value : number;
    effect : string;
    school : string;
}

 export type CardDisplayProps = {
    index? : number;
    selected? : boolean;
    onClick?: () => void;
    className?: string;
    flipped?: boolean;
    hover?:boolean;
}

export type CardProps = {
  data : CardDataProps
  display : CardDisplayProps
}

export function Card({data, display}: CardProps) {
  let {face,back,name} = data
  let {flipped=false,onClick,selected=false,className='',hover} = display
   
  return (
    <img
      src={flipped ? back : face}
      alt={name}
      className={`card ${selected ? "selected" : ""} ${hover ? "hovered" : ""}`}
    />
  );
}
