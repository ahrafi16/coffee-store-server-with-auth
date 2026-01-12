// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// console.log(process.env.DB_USER);

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rinnvkt.mongodb.net/?appName=Cluster0`;


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
//     tls: true,
//     tlsAllowInvalidCertificates: false
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         const coffeesCollection = client.db('coffeeDB').collection('coffees');
//         const usersCollection = client.db('coffeeDB').collection('users');


//         // get coffee
//         app.get('/coffees', async (req, res) => {
//             const result = await coffeesCollection.find().toArray();
//             res.send(result);
//         })

//         // get a single coffee by id
//         app.get('/coffees/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await coffeesCollection.findOne(query);
//             res.send(result);
//         })

//         // post coffee
//         app.post('/coffees', async (req, res) => {
//             const newCoffee = req.body;
//             console.log(newCoffee);
//             const result = await coffeesCollection.insertOne(newCoffee);
//             res.send(result);
//         })

//         // update a coffee
//         app.put('/coffees/:id', async (req, res) => {
//             const id = req.params.id;
//             const filter = { _id: new ObjectId(id) };
//             const options = { upsert: true };
//             const updatedCoffee = req.body;
//             const updatedDoc = {
//                 $set: updatedCoffee
//             }

//             const result = await coffeesCollection.updateOne(filter, updatedDoc, options);
//             res.send(result);
//         })

//         // delete a coffee
//         app.delete('/coffees/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await coffeesCollection.deleteOne(query);
//             res.send(result);
//         })

//         // user related APIs here

//         // get users from the database
//         app.get('/users', async (req, res) => {
//             const result = await usersCollection.find().toArray();
//             res.send(result);
//         })

//         // get a single user by id
//         app.get('/users/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await usersCollection.findOne(query);
//             res.send(result);
//         })

//         // post user to the database
//         app.post('/users', async (req, res) => {
//             const userProfile = req.body;
//             console.log(userProfile);
//             const result = await usersCollection.insertOne(userProfile);
//             res.send(result);
//         })

//         // send last signin time to db
//         app.patch('/users', async (req, res) => {
//             const { email, lastSignInTime } = req.body;
//             const filter = { email: email }
//             const updatedDoc = {
//                 $set: {
//                     lastSignInTime: lastSignInTime
//                 }
//             }
//             const result = await usersCollection.updateOne(filter, updatedDoc)
//             res.send(result);
//         })

//         // delete user from the database
//         app.delete('/users/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await usersCollection.deleteOne(query);
//             res.send(result);
//         })


//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('Coffee Server is getting ready now!');
// });

// app.listen(port, () => {
//     console.log(`Coffee Store Server is running on port: ${port}`);
// });
















const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const connectDB = require("./mongo");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Coffee Server is running");
});

// ----------- COFFEES ROUTES -----------

app.get("/coffees", async (req, res) => {
  try {
    const db = await connectDB();
    const coffees = await db.collection("coffees").find().toArray();
    res.send(coffees);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/coffees/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const coffee = await db
      .collection("coffees")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.send(coffee);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/coffees", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("coffees").insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put("/coffees/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("coffees").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { upsert: true }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete("/coffees/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("coffees")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ----------- USERS ROUTES -----------

app.get("/users", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("users").insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.patch("/users", async (req, res) => {
  try {
    const { email, lastSignInTime } = req.body;
    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: { lastSignInTime },
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Required for Vercel serverless
module.exports = app;
