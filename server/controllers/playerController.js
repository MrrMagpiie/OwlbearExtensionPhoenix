import {PlayerModel} from '../models/Player.js';
import deck from './deckController.js'

async function getPlayerById(owlID){
    try {
      const player = await PlayerModel.findOne({owlID:owlID})
      return player
    } catch (err){
      throw new Error(`Error fetching player ${err.message}`)
    }
}
async function createPlayer(owlID,gameID) {
  try {
    const newDeck = await new deck.createDeck()
    let playerData={
      owlID:owlID,
      gameID:gameID,
      deck:newDeck,
      health:5,
      sparks:10
    }
    const player = new PlayerModel(playerData);
    const savedPlayer = await player.save();
    return savedPlayer;
  } catch (err) {
    throw new Error(`Failed to create player: ${err.message}`);
  }
}
async function updatePlayer(owlID,update) {
  try{
    const updatedPlayer = PlayerModel.findOneAndUpdate(owlID,update,{new:true})
    return updatedPlayer
  }catch (err){
    throw new Error(`Failed to update player: ${err.message}`)
  }
}
async function updatePlayerDeck(owlID,update){
  let playerDeck;
  try{
    playerDeck = getPlayerById(owlID).deck;
  }catch(err){
    throw new Error(`Error fetching player: ${err.message}`);
  }
  try{
    const updatedDeck = deck.updateDeck(playerDeck,update);
    return updatedDeck
  }catch (err){
    throw err
  }
}

export default {
    getPlayerById,
    createPlayer,
    updatePlayer,
    updatePlayerDeck
};