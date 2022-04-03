const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


//Jak usunac wszystkie review podczas usuwania campgroundu - QueryMiddleware
//Middleware - funkcha odpalana po FindOneAndDelete 
//https://mongoosejs.com/docs/middleware.html
//https://mongoosejs.com/docs/api.html#query_Query-findOneAndDelete
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);