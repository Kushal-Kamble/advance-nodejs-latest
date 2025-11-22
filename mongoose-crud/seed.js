// seed.js
// यह script local MongoDB (mongodb://127.0.0.1:27017/mvc_crud) में
// कुछ dummy restaurants डाल देता है ताकि तुम Postman में तुरंत test कर सको।

const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant'); // अपने model path को verify कर लो

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mvc_crud';

const dummyData = [
  {
    name: "Hotel Taj",
    address: "Mumbai, Colaba",
    cuisine: "Indian",
    rating: 5
  },
  {
    name: "Spice Villa",
    address: "Pune, Koregaon Park",
    cuisine: "North Indian",
    rating: 4.2
  },
  {
    name: "Green Garden Cafe",
    address: "Bengaluru, Indiranagar",
    cuisine: "Continental",
    rating: 4.5
  },
  {
    name: "Noodle House",
    address: "Hyderabad, Banjara Hills",
    cuisine: "Chinese",
    rating: 4.0
  },
  {
    name: "Saffron Dine",
    address: "Delhi, Connaught Place",
    cuisine: "Mughlai",
    rating: 4.7
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected for seeding');

    // पुरानी collection साफ कर दो (optional)
    await Restaurant.deleteMany({});
    console.log('Existing restaurants deleted');

    // dummy data insert करो
    const created = await Restaurant.insertMany(dummyData);
    console.log(`✅ ${created.length} restaurants inserted`);
    created.forEach(r => console.log(r._id.toString(), '-', r.name));

    await mongoose.disconnect();
    console.log('Mongo disconnected. Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
