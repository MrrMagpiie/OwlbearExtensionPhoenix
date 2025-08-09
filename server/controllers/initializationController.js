// Split cards from sheets
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import models from '../models/index';
import cardData from '../assets/cards-csv.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = await Promise.all([fs.promises.readFile(path.join(__dirname,'../assets/cards-csv.json'), 'utf-8'),]);
const db = JSON.parse(data)



export async function seedData(MONGO_URI) {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    //clear old data if there is any
    await models.Card.deleteMany({});
    await models.Game.deleteMany({});
    await models.Deck.deleteMany({});
    await models.Player.deleteMany({});

    // Insert card data
    await models.Card.insertMany(
      cardData
    );

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};
