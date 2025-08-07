import {CardModel} from '../models/Card.js';
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

async function getCardById(cardId){
    try {
      const card = await CardModel.findById(cardId)
        if (!card) {
          return {error: 'Card not Found'};
        }
      return card
    } catch (err){
      console.error('Error fetching card', err);
      return { error: 'Something went wrong' };
    }
}
async function createCard(cardData) {
  try {
    const card = new CardModel(cardData);
    const savedCard = await card.save();
    return savedCard.name;
  } catch (err) {
    throw new Error(`Failed to create card: ${err.message}`);
  }
}

export default {
    getCardById,
    createCard,
};