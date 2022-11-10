const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 7000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8uwwnp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//

async function run() {
  try {
    const serviceCollection = client
      .db("peaceTourismDB")
      .collection("services");

    const bookingCollection = client
      .db("peaceTourismDB")
      .collection("bookings");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // bookings api
    app.get("/bookings", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // POST method
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // DELETE method
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

//
app.get("/", (req, res) => {
  res.send("Hello from peace tourism");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
