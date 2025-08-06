import Player from '../models/Player.js';
import deck from './deckController.js'

async function getPlayerById(playerId){
    try {
      const player = await Player.PlayerModel.findOne({owlId:playerId})
      if (!player) {
        return {error: 'player not Found'};
      }
      return player
    } catch (err){
      console.error('Error fetching player', err);
      return { error: 'Something went wrong' };
    }
}
async function createPlayer(playerData) {
  try {
    const newDeck = await new deck.createDeck()
    playerData.deck = newDeck
    const player = new player.playerModel(playerData);
    const savedPlayer = await player.save();
    return savedPlayer;
  } catch (err) {
    throw new Error(`Failed to create player: ${err.message}`);
  }
}

export default {
    getPlayerById,
    createPlayer,
};