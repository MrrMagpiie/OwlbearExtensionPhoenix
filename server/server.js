import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import routes from './routes/index.js';
import mongoose from "mongoose";
import { updateEnvFile } from "../scripts/updateEnvFile.js";
import { seedData } from "./controllers/initializationController.js";


//---------------
dotenv.config({ path: "../.env" });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());
// Allow express to use cors
app.use(cors({
  origin: 'http://localhost:5173'
}));

// api Routes
app.use('/api/cards', routes.cardRoutes);
app.use('/api/games',routes.gameRoutes);
app.use('/api/decks',routes.deckRoutes);
app.use('/api/players',routes.playerRoutes);

//Server connection code
  if (!process.env.MONGO_DB_ADRESS){
    await updateEnvFile('MONGO_DB_ADRESS','mongodb://localhost:27017/Phoenix','../.env')
    await seedData(process.env.MONGO_DB_ADRESS)
  } 
   await mongoose.connect(process.env.MONGO_DB_ADRESS)
   .then(() => {
    console.log(`Connected to ${mongoose.connection.name}`)
    if (!global.__serverStarted){
      app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
      });
      global._serverStarted = true;
    }
   });

