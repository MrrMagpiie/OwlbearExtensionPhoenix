import {PlayerModel} from '../models/Player.js';
import deck from './deckController.js'

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
  }
}


async function getPlayerById(owlID){
    try {
      const player = await PlayerModel.findOne({owlID:owlID})
      if (player == null){
        throw new NotFoundError(`Player Does not exist`)
      }else{
        return player
      }
    } catch (err){
      if (err instanceof NotFoundError){
        throw err
      }else{
        throw new DatabaseError(`Error fetching player ${err.message}`)}
      
    }
}
async function createPlayer(owlID,gameID) {
    //tries to find player in db, if cant then creates a new one. probably a bad way to do it but should work
    try{  
      await getPlayerById(owlID+gameID)
    }catch{
      try {
        const newDeck = await deck.createDeck()
        let playerData={
          'owlID':owlID+gameID,
          'gameID':gameID,
          'deck':newDeck,
          'health':5,
          'sparks':10
        }
        const player = new PlayerModel(playerData);
        const savedPlayer = await player.save();
        return savedPlayer;
      }catch(err){
        throw new Error(`failed to create player: ${err.message}`)
      }
  }
  
}
async function updatePlayer(owlID,update) {
  try{
    const updatedPlayer = await PlayerModel.findOneAndUpdate(owlID,update,{new:true})
    if (updatedPlayer==null){
      throw new NotFoundError(`Player does not exist`)
    }else{
      return updatedPlayer
    }
  }catch (err){
    if (err instanceof(NotFoundError)){
      throw err
    }else{
      throw new Error(`Failed to update player: ${err.message}`)
    }
    
  }
}
async function updatePlayerDeck(owlID,update){
  let playerDeck;
  try{
    playerDeck = (await getPlayerById(owlID)).deck;
  }catch(err){
    throw new Error(`Error fetching player: ${err.message}`);
  }
  try{
    const updatedDeck = await deck.updateDeck(playerDeck,update);
    return updatedDeck
  }catch (err){
    throw err
  }
}
async function getPlayerDeck(owlID){
  let playerDeck
  try{
    playerDeck = (await getPlayerById(owlID)).deck;
  }catch(err){
    throw new Error(`Error fetching player: ${err.message}`);
  }
  try{
    let outDeck = await deck.getDeckById(playerDeck)
    return outDeck
  }catch (err){
    throw err
  }
}

export default {
    getPlayerById,
    createPlayer,
    updatePlayer,
    updatePlayerDeck,
    getPlayerDeck,
};