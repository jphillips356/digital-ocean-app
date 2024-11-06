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

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'frontend')));
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

app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
        
     var error = '';
    
      const { login, password } = req.body;
    
      const db = client.db('LargeProject');
      const results = await db.collection('users').find({Login:login,Password:password}).toArray();
    
      var id = -1;
      var fn = '';
      var ln = '';
    
      if( results.length > 0 )
      {
        id = results[0].UserID;
        fn = results[0].FirstName;
        ln = results[0].LastName;
      }
    
      var ret = { id:id, firstName:fn, lastName:ln, error:''};
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

// Serve index.html for the root route 
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
