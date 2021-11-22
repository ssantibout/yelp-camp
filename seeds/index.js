require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDb = async () => {
    console.log()
    await Campground.deleteMany();
    for (let i = 0; i < 20; i++) {
        let random1000 = Math.floor(Math.random() * 1000);
        const newCampground = new Campground({
            author: "6189f2faf14c1cd9c34c7ec5",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price: Math.floor(Math.random() * 50) + 1,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, nobis pariatur quaerat perferendis odit praesentium mollitia beatae qui iusto culpa quos laborum dolorum repellendus voluptates veritatis voluptatem voluptas tempora? Eveniet!"
        });
        try {
            // const url = `https://api.unsplash.com/photos/random?query=campground&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
            const url = "https://source.unsplash.com/collection/483251";
            // const img = await axios.get(url);
            // console.log('=============================')
            // console.log(img)
            // console.log('=============================')
            // newCampground.images.push(img.data)
            newCampground.images.push({ url, filename: 'seed image' })
            await newCampground.save();
        } catch (e) {
            console.clear();
            console.log(e)
        }
    }
}



















// const sample = array => array[Math.floor(Math.random() * array.length)];


// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 300; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const price = Math.floor(Math.random() * 20) + 10;
//         const camp = new Campground({
//             //YOUR USER ID
//             author: '5f5c330c2cd79d538f2c66d9',
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`,
//             description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
//             price,
//             geometry: {
//                 type: "Point",
//                 coordinates: [
//                     cities[random1000].longitude,
//                     cities[random1000].latitude,
//                 ]
//             },
//             images: [
//                 {
//                     url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
//                     filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
//                 },
//                 {
//                     url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
//                     filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
//                 }
//             ]
//         })
//         await camp.save();
//     }
// }

seedDb().then(() => {
    mongoose.connection.close();
    console.log('Mongoose Connection Closed')
})