import Deck from '../models/Deck.js';

async function getDeckById(deckId){
    try {
      const deck = await Deck.DeckModel.findById(deckId)
      if (!deck) {
        return {error: 'Deck not Found'};
      }
      return deck
    } catch (err){
      console.error('Error fetching deck', err);
      return { error: 'Something went wrong' };
    }
}


async function createDeck(deckData) {
  try {
    const deck = new Deck.DeckModel(deckData);
    const savedDeck = await deck.save();
    return savedDeck.id; 
  } catch (err) {
    throw new Error(`Failed to create Deck: ${err.message}`);
  }
}

export default {
    getDeckById,
    createDeck,
};