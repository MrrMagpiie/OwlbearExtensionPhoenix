import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import routes from './routes/index.js';
import mongoose from "mongoose";

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
   await mongoose.connect(process.env.MONGO_DB_ADRESS)
   .then(() => {
    console.log(`Connected to ${mongoose.connection.name}`)
    app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    });
   });

