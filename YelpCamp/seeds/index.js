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
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random20 = Math.floor(Math.random() * 20) + 2;
        const camp = new Campground({
            author: '624ad96c0a618083e8c675d4', //default user Id
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque assumenda nulla odio sed ipsam aut totam cupiditate voluptas. Quasi possimus architecto sit at quae atque, error doloremque reprehenderit dolores consequuntur?",
            price: random20,
            images: [
                {
                    url: 'https://res.cloudinary.com/kinosokolclaudinary/image/upload/v1649164983/YelpCamp/e9yauoty30ueiwviedo5.jpg',
                    filename: 'YelpCamp/e9yauoty30ueiwviedo5',
                },
                {
                    url: 'https://res.cloudinary.com/kinosokolclaudinary/image/upload/v1649164983/YelpCamp/qjq3acymyrcdske6biks.jpg',
                    filename: 'YelpCamp/qjq3acymyrcdske6biks',
                }
            ],
            //mapbox
            geometry: {
                type: 'Point',
                coordinates: [21.03333, 52.21667]
            }

        })
        await camp.save();

    }
    console.log("Baza danych zaktualizowana o randomowe dane")
}

seedDB().then(() => {
    mongoose.connection.close();
});