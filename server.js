// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Initialize Express app
const app = express();

const port = 8080;
//const port = 5000;


// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://whale-app-ambkm.ondigitalocean.app'],
    credentials: true
}));

app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, 'frontend')));

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

//     app.get('*', (req, res) => { 
//         res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html')); 
//     });
// }

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => { 
   res.sendFile(path.join(__dirname, 'frontend/dist', 'frontend/dist/index.html')); 
});


// MongoDB connection
const url = process.env.MONGODB_URL;
//const url = 'mongodb+srv://jishdotcom:COP4331IsCool@cluster0.rqrdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Exit if there is a connection error
    }
    console.log("MongoDB connected successfully");
});


app.post('/api/login', async (req, res) => {
    // Incoming: login, password
    const { login, password } = req.body;

    try {
        const db = client.db('LargeProject');
        
        // Check if user exists by login
        const user = await db.collection('users').findOne({ Login: login });
        console.log(user)
        if (!user) {
            // User not found
            return res.status(404).json({ id: -1, firstName: '', lastName: '', error: 'User not found' });
        }

        // Check if password matches
        if (user.Password !== password) {
            // Password does not match
            return res.status(401).json({ id: -1, firstName: '', lastName: '', error: 'Incorrect password' });
        }

        // Successful login
        const { UserID, FirstName, LastName } = user;
        res.status(200).json({ id: UserID, firstName: FirstName, lastName: LastName, error: '' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ id: -1, firstName: '', lastName: '', error: 'An error occurred' });
    }
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

app.post('/api/habits', async (req, res) => {
    const { name, measurementType, measurementUnit, frequency } = req.body;

    if (!name || !measurementType || !measurementUnit || !frequency) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const habit = { name, measurementType, measurementUnit, frequency };
    try {
        const db = client.db('LargeProject');
        const habitsCollection = db.collection('habits');
        const result = await habitsCollection.insertOne(habit);
        res.status(201).json({ success: true, habitId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Could not create habit" });
    }
});



// Get all habits
app.get('/api/habits', async (req, res) => {
    try {
        const db = client.db('LargeProject');
        const habitsCollection = db.collection('habits');
        const habits = await habitsCollection.find().toArray();
        res.status(200).json(habits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve habits" });
    }
});

// Update a habit by ID
app.put('/api/habits/:id', async (req, res) => {
    const { id } = req.params;
    const { name, measurementType } = req.body;

    try {
        const db = client.db('LargeProject');
        const habitsCollection = db.collection('habits');
        const result = await habitsCollection.updateOne(
            { _id: new MongoClient.ObjectId(id) },
            { $set: { name, measurementType } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not update habit" });
    }
});

// Delete a habit by ID
app.delete('/api/habits/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = client.db('LargeProject');
        const habitsCollection = db.collection('habits');
        const result = await habitsCollection.deleteOne({ _id: new MongoClient.ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Habit not found" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete habit" });
    }
});



// Serve index.html for the root route 
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});