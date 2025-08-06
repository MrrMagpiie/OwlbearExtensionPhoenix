import mongoose from "mongoose";
const playerSchema = new mongoose.Schema({
    owlID : String, //Id from OBR.player
    gameId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Game'}, //Id from the game this player exists in
    deck : {type: mongoose.Schema.Types.ObjectId, ref: 'Deck'}, // Id for the deck this player has
    health : Number, // number of healthtokens this player has
    sparks : Number, // number of sparks this player has
})
const PlayerModel = mongoose.model('Player',playerSchema)

export default {
    PlayerModel
}