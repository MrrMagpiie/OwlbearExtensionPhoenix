import mongoose from "mongoose";
const gameSchema = new mongoose.Schema({
    name : String, 
    roomId : String, // roomId from Owlbear
    players : [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],

})
const GameModel = mongoose.model('Game',gameSchema)
export {
    GameModel
}