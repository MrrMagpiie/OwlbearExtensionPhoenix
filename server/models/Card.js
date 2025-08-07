import mongoose from "mongoose";
const cardSchema = new mongoose.Schema({
    type : String,
    name : String,
    face : String, // img path
    back : String, // img path
    value : Number,
    effect : String,
    school : String,
})
const CardModel = mongoose.model('Card',cardSchema)
export {
    CardModel
}