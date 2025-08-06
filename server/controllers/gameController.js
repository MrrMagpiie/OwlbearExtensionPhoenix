import Game from '../models/Game.js';

async function getGameById(gameId){
    try {
      const game = await Game.GameModel.findById(gameId)
      if (!game) {
        return {error: 'Game not Found'};
      }
      return game
    } catch (err){
      console.error('Error fetching Game', err);
      return { error: 'Something went wrong' };
    }
}
async function upsertGame(gameData) {
  try {
    const game = new Game.GameModel(gameData);
    const savedGame = await game.findOneAndUpdate({upsert:true});
    return savedGame;
  } catch (err) {
    throw new Error(`Failed to create game: ${err.message}`);
  }
}



export default {
    getGameById,
    upsertGame,
};