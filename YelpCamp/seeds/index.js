const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// const sample = (array) => array[Math.floor(Math.random() * array.length)];
const sample = function (array) {
    return array[Math.floor(Math.random() * array.length)]
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20) + 2;
        const camp = new Campground({
            author: '624ad96c0a618083e8c675d4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque assumenda nulla odio sed ipsam aut totam cupiditate voluptas. Quasi possimus architecto sit at quae atque, error doloremque reprehenderit dolores consequuntur?",
            price: random20
        })
        await camp.save();

    }
    console.log("Baza danych zaktualizowana o randomowe dane")
}

seedDB().then(() => {
    mongoose.connection.close();
});