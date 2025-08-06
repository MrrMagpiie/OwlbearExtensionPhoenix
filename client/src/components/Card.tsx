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
    selected? : boolean;
    onClick?: () => void;
    className?: string;
    flipped?: boolean;
}

export type CardProps = {
  data : CardDataProps
  display : CardDisplayProps
}

export function Card({data, display}: CardProps) {
  const {face,back,name} = data
  const {flipped=false,onClick,selected=false,className=''} = display
   
  return (
    <img
      src={flipped ? back : face}
      alt={name}
      className={`card ${selected ? "selected" : ""} ${className}`}
      onClick={onClick}
    />
  );
}
