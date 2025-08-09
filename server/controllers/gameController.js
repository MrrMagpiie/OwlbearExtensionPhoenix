import {GameModel} from '../models/Game.js';
import playerController from './playerController.js';

async function getGameById(gameId){
    try {
      const game = await GameModel.findById(gameId)
      return game
    } catch (err){
      throw new Error(`Error fetching game: ${er.message}`)
    }
}
async function createGame() {
  try {
    const game = new GameModel();
    const savedGame = await game.save();
    return savedGame;
  } catch (err) {
    throw new Error(`Failed to create game: ${err.message}`);
  }
}
async function updateGame(filter, update){
  try{
    const updatedGame = GameModel.findOneAndUpdate(filter, update, {new:true})  
    if(updatedGame==null){
      throw new Error(`Game does not exist`)
    }else{
      return updatedGame
    }
  }catch (err){
    throw new Error(`Failed to update game: ${err.message}`)
  }
  
}
async function updatePlayersList(filter,player){
    try{
    let game = await getGameById(filter)
    let addPlayer = await playerController.getPlayerById(player)
    if (!(game.players.includes(addPlayer._id))){
      await game.players.push(addPlayer._id);
    }else{
      return{error: `player already present`}
    } 
    let updatedGame = await game.save()
    return updatedGame  
  }catch (err){
    console.log(err)
    throw new Error(`Failed to update game: ${err.message}`)
    
  }
}
export default {
    getGameById,
    createGame,
    updateGame,
    updatePlayersList
};