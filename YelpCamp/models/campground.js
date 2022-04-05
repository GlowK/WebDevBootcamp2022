const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//virtual schemas https://mongoosejs.com/docs/tutorials/virtuals.html
//Image from cloudinary:
// https://res.cloudinary.com/kinosokolclaudinary/image/upload/v1649160609/cld-sample.jpg

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

//https://res.cloudinary.com/kinosokolclaudinary/image/upload/w_200/v1649160609/cld-sample.jpg


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    //Mapbox
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});


//Jak usunac wszystkie review podczas usuwania campgroundu - QueryMiddleware
//Middleware - funkcha odpalana po FindOneAndDelete 
//https://mongoosejs.com/docs/middleware.html
//https://mongoosejs.com/docs/api.html#query_Query-findOneAndDelete
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        // console.log(res);
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);