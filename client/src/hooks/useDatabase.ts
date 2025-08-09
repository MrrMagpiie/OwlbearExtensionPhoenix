
export const useDatabase = {
    async newGame(){

       let res:Response = await fetch(`/api/games`,{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({})
            })
            
            return res
    },
    async getGame(id:string){
         
       let res:Response = await fetch(`/api/games/${id}`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'},
            })
            
            return res
    },
    async updateGame(gameID:string,body:{}){
         
       let res:Response = await fetch(`/api/games/${gameID}`,{
            method:'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            })
            
            return res
    },
    async updatePlayerList(gameID:string,body:{playerID:string}){
    
       let res:Response = await fetch(`/api/games/${gameID}/player`,{
            method:'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            })
            
            return res
    },
    async newPlayer(body:{}){
         console.log(body)
       let res:Response = await fetch(`api/players/new`,{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            })
            
            return res
    },
    async getPlayer(id:string){

       let res:Response = await  fetch(`/api/players/${id}`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'},
            })
            
            return res
    },
    async getPlayerDeck(id:string){
         
       let res:Response = await fetch(`/api/players/${id}/deck`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'},
            })
            
            return res
    },
     async updatePlayerDeck(id:string,body:{}){   
     let res:Response = await fetch(`/api/players/${id}/deck`,{
            method:'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            })
            
            return res
    },
     async getCard(id:string){
    
       let res:Response = await fetch(`/api/cards/${id}`,{
            method:'Get',
            headers:{'Content-Type': 'application/json'},
            })
            
            return res
    },

}
