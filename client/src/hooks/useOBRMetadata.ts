import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useState, useRef} from 'react'

//this is how the structure of the metadata for the application should be
export type metadata = {

    id: string
    spread:{
        owner:string
        cards:any[]
        assist:{[key: string]: any[];}
    }
}

export function isMetadata(obj:any):obj is metadata{
    return(
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.spread === 'object' &&
        obj.spread !== null &&
        typeof obj.spread.owner === 'string' &&
        typeof obj.spread.cards === 'object' &&
        typeof obj.spread.assist === 'object'
    )
}

export type useOBRMetadataProps = {
    appID?: string
    changes?:metadata
}

const defMetadata: metadata = {
        id:'',
        spread:{
            owner:'',
            cards:[],
            assist:{}
        }  
    }

export function useOBRMetadata(appID = "com.my-extension.phoenix/metadata"){
    const metadata = useRef<metadata>(defMetadata)
    const [displayMetadata,setMetadata] = useState<metadata>(metadata.current)
    const metaInit = useRef(false)
    
    const startup = async () =>{
        if(!metaInit.current){
        let startMetadata:any = await OBR.room.getMetadata()
        console.log(`startMetadata: ${JSON.stringify(startMetadata)}`)
            if (isMetadata(startMetadata[appID])){
                metadata.current = (startMetadata[appID])
                metaInit.current = true
                subscribe()

            }else{
                setOBRMetadata({changes:metadata.current})
                metaInit.current = true
                subscribe()
            }
        }
    }
    const subscribe = () =>{
        if(metaInit.current){
        const unsubscribe =  OBR.room.onMetadataChange((newMetadata)=>{
            if (isMetadata(newMetadata[appID])){
                metadata.current = (newMetadata[appID])
                setMetadata(metadata.current)
                console.log(metadata.current)
            }
        });
        }
    }

    return {metadata,startup,displayMetadata}
    
    
}

export function setOBRMetadata({appID = "com.my-extension.phoenix/metadata",changes}:useOBRMetadataProps){
        if (OBR.isReady){
            OBR.room.setMetadata({[appID]:changes})}    
}