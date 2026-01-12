// mongo.js
const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rinnvkt.mongodb.net/?appName=Cluster0`
    );
    await client.connect();
    db = client.db("coffeeDB");
  }
  return db;
}

module.exports = connectDB;
