import mongoose from "mongoose";
const gameSchema = new mongoose.Schema({
    name : String, 
    players : [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],

})
const GameModel = mongoose.model('Game',gameSchema)
export {
    GameModel
}