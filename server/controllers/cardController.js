import {CardModel} from '../models/Card.js';
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

async function getCardById(cardId){
    try {
      const card = await CardModel.findById(cardId)
        if (!card) {
          throw new NotFoundError(`Card does not exist`)
        }
      return card
    } catch (err){
      if(err instanceof NotFoundError) {throw err}else{ 
      throw new Error(`Failed to fetch card: ${err.message}`)
      }
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