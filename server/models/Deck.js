import mongoose from "mongoose";
const deckSchema = new mongoose.Schema({
    hand : [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
    draw : [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
    discard : [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
})
const DeckModel = mongoose.model('Deck',deckSchema)
export default {
    DeckModel
}