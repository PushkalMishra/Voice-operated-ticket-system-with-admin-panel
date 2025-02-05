const mongoose=require('mongoose')
const traind=require('./mp')
const Train=require('../models/train');

mongoose.connect('mongodb://127.0.0.1:27017/voiceoperation');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
  // Clear existing data
  await Train.deleteMany({});
  
  // Insert new train data from train.js
  await Train.insertMany(traind);

  console.log('Train data uploaded');
};

// Seed and close connection
seedDB().then(() => {
  mongoose.connection.close();
});