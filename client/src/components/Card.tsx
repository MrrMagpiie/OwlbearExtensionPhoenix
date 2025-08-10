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

export function isCardDataProps(obj: any): obj is CardDataProps {
  return (
    obj &&
    typeof obj._id === "string" &&
    typeof obj.type === "string" &&
    typeof obj.name === "string" &&
    typeof obj.face === "string" &&
    typeof obj.back === "string" &&
    typeof obj.value === "number" &&
    typeof obj.effect === "string" &&
    typeof obj.school === "string"
  );
}

 export type CardDisplayProps = {
    index : number;
    selected? : boolean;
    className?: string;
    flipped?: boolean;
    hover?:boolean;
}

export function isCardDisplayProps(obj: any): obj is CardDisplayProps {
  return (
    obj &&
    typeof obj.index === "number" &&
    (obj.selected === undefined || typeof obj.selected === "boolean") &&
    (obj.className === undefined || typeof obj.className === "string") &&
    (obj.flipped === undefined || typeof obj.flipped === "boolean") &&
    (obj.hover === undefined || typeof obj.hover === "boolean")
  );
}

export type CardProps = {
  data : CardDataProps
  display : CardDisplayProps
}

export function isCardProps(obj: any): obj is CardProps {
  return (
    obj &&
    isCardDataProps(obj.data) &&
    isCardDisplayProps(obj.display)
  );
}

export function Card({data, display}: CardProps) {
  let {face,back,name} = data
  let {flipped=false,selected=false,className='',hover} = display
   
  return (
    <img
      src={flipped ? back : face}
      alt={name}
      className={`card ${selected ? "selected" : ""} ${hover ? "hovered" : ""}`}
    />
  );
}
