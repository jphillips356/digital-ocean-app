// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
//const url = process.env.MONGODB_URL;
const url = 'mongodb+srv://jishdotcom:COP4331@cluster0.rqrdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit if there is a connection error
  }
  console.log("MongoDB connected successfully");
});

// Login route
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = client.db('LargeProject');
    const results = await db.collection('users').findOne({ Login: login, Password: password });

    if (results) {
      const { UserID: id, FirstName: firstName, LastName: lastName } = results;
      res.status(200).json({ id, firstName, lastName, error: '' });
    } else {
      res.status(400).json({ id: -1, firstName: '', lastName: '', error: 'User/Password combination incorrect' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ id: -1, firstName: '', lastName: '', error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
