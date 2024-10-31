const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Make sure to import cookie-parser
const { MongoClient } = require('mongodb'); // Importing MongoClient here
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

app.set("port", PORT);

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://www.tracktion.fun/",
        "https://www.trakction.fun/",
    ],
    credentials: true, // Access-Control-Allow-Credentials: true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error('Error connecting to MongoDB:', e);
    }
}

connectDB();

app.post('/api/addcard', async (req, res, next) => {
    const { userId, card } = req.body;
    const newCard = { Card: card, UserId: userId };
    let error = '';

    try {
        const db = client.db('LargeProject');
        await db.collection('Cards').insertOne(newCard);
    } catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    const { login, password } = req.body;
    let error = '';

    const db = client.db('LargeProject');
    const results = await db.collection('users').find({ Login: login, Password: password }).toArray();

    let id = -1;
    let fn = '';
    let ln = '';

    if (results.length > 0) {
        id = results[0].UserID;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

app.post('/api/register', async (req, res) => {
  let error = '';

  // Destructure the incoming request
  const { login, password, firstName, lastName } = req.body;

  try {
    const db = client.db('LargeProject');
    const usersCollection = db.collection('users');

    // Check if the login already exists
    const existingUser = await usersCollection.findOne({ Login: login });
    if (existingUser) {
      error = 'Username already taken';
      return res.status(400).json({ success: false, error });
    }

    // Generate a new UserID (assuming it’s the next sequential ID)
    const lastUser = await usersCollection.find().sort({ UserID: -1 }).limit(1).toArray();
    const newUserID = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;

    // Insert the new user
    const newUser = {
      Login: login,
      Password: password, // Note: Hashing is recommended here for security.
      FirstName: firstName,
      LastName: lastName,
      UserID: newUserID
    };
    await usersCollection.insertOne(newUser);

    // Respond with success message
    res.status(201).json({ success: true, error: '' });
  } catch (e) {
    console.error(e);
    error = 'An error occurred during registration';
    res.status(500).json({ success: false, error });
  }
});

app.post('/api/searchcards', async (req, res, next) => {
    const { userId, search } = req.body;
    const _search = search.trim();
    let error = '';

    const db = client.db('LargeProject');
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();

    const _ret = results.map(result => result.Card); // Use map to simplify the code

    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
