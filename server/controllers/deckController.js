import {DeckModel} from '../models/Deck.js';

async function getDeckById(deckId){
    try {
      const deck = await DeckModel.findById(deckId)
      return deck
    } catch (err){
      throw new Error(`Error fetching deck ${err.message}`)
    }
}

async function createDeck(deckData) {
  try {
    const deck = new DeckModel(deckData);
    const savedDeck = await deck.save();
    return savedDeck.id; 
  } catch (err) {
    throw new Error(`Failed to create deck: ${err.message}`);
  }
}

async function updateDeck(deckId,update){
  try {
    const updatedDeck = await DeckModel.findOneAndUpdate(deckId,update,{new:true});
    return updatedDeck;
  }catch (err){
    throw new Error(`Failed to update deck: ${err.message}`)
  }
}

export default {
    getDeckById,
    createDeck,
    updateDeck,
};