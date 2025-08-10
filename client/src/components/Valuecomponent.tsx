import {useState} from "react";
import './value.css'

type valueProp = {
    value:number
}

export function Valuecomponent({value}:valueProp) {

    return(
        <div className = 'value-container'>
            {value}
        </div>
    )
}