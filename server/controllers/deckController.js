import {DeckModel} from '../models/Deck.js';

async function getDeckById(deckId){
    try {
      const deck = await DeckModel.findById(deckId)
      return deck
    } catch (err){
      throw new Error(`Error fetching deck ${err.message}`)
    }
}

async function createDeck() {
  try {
    let deckData = {
        'hand' : [],
        'draw' : ['688cf71ec9c00c98ff5d862d','688cf71ec9c00c98ff5d862e','688cf71ec9c00c98ff5d8630','688cf71ec9c00c98ff5d862f','688cf71ec9c00c98ff5d862f','688cf71ec9c00c98ff5d8630','688cf71ec9c00c98ff5d862e','688cf71ec9c00c98ff5d862d'],
        'discard' : [],
    }
    const deck = new DeckModel(deckData);
    const savedDeck = await deck.save();
    return savedDeck._id; 
  } catch (err) {
    throw new Error(`Failed to create deck: ${err.message}`);
  }
}

async function updateDeck(deckId,update){
  try {
    const updatedDeck = await DeckModel.findOneAndUpdate(deckId,update,{new:true});
    if (updateDeck==null){
      throw new Error(`Deck Does not exist`)
    }else{
      return updatedDeck;
    }
  }catch (err){
    throw new Error(`Failed to update deck: ${err.message}`)
  }
}

export default {
    getDeckById,
    createDeck,
    updateDeck,
};