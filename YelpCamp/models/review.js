const mongoose = require('mongoose');
const Schema = mongoose.Schema; // to samo co const {Schema} = mongoose;


const reviewSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);
