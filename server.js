const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 8080;
// const port = 5000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const url = process.env.MONGODB_URL;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect()
  .then(() => {
    console.log("Connected successfully to MongoDB");
    db = client.db('LargeProject');
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Habits API routes
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await db.collection('habits').find().toArray();
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/habits', async (req, res) => {
  try {
    const { name, measurementType, measurementUnit, frequency } = req.body;
    const newHabit = { name, measurementType, measurementUnit, frequency, streak: 0, goal: 30 };
    const result = await db.collection('habits').insertOne(newHabit);
    res.status(201).json({ ...newHabit, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, measurementType, measurementUnit, frequency, streak, goal } = req.body;
    const result = await db.collection('habits').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, measurementType, measurementUnit, frequency, streak, goal } },
      { returnDocument: 'after' }
    );
    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Habit not found' });
    }
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('habits').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Habit deleted successfully' });
    } else {
      res.status(404).json({ error: 'Habit not found' });
    }
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});