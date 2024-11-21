const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 8080;
//const port = 5000; 

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

// Serve index.html for the root route 
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    });
  
  // Start server
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });