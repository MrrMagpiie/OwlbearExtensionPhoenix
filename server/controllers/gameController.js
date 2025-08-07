import {GameModel} from '../models/Game.js';

async function getGameById(gameId){
    try {
      const game = await GameModel.findById(gameId)
      return game
    } catch (err){
      throw new Error(`Error fetching game: ${er.message}`)
    }
}
async function createGame(gameData) {
  try {
    const game = new GameModel(gameData);
    const savedGame = await game.save();
    return savedGame;
  } catch (err) {
    throw new Error(`Failed to create game: ${err.message}`);
  }
}
async function updateGame(filter, update){
  try{
    const updatedGame = GameModel.findOneAndUpdate(filter, update, {new:true})  
    return updatedGame  
  }catch (err){
    throw new Error(`Failed to update game: ${err.message}`)
  }
  
}

export default {
    getGameById,
    createGame,
    updateGame
};