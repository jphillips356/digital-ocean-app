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

const bcrypt = require('bcrypt'); // Ensure bcrypt is required at the top

// app.post('/api/login', async (req, res, next) => {
//     // incoming: login, password
//     // outgoing: id, firstName, lastName, error
    
//     const { login, password } = req.body;
//     let error = '';

//     try {
//         const db = client.db('LargeProject');

//         // Find the user by login
//         const user = await db.collection('users').findOne({ Login: login });

//         // Check if the user exists
//         if (!user) {
//             error = "No account exists with that username.";
//             return res.status(404).json({ id: -1, firstName: "", lastName: "", error });
//         }

//         // Compare the password with the stored hash
//         const match = await bcrypt.compare(password, user.Password);

//         if (!match) {
//             error = "Password does not match.";
//             return res.status(401).json({ id: -1, firstName: "", lastName: "", error });
//         }

//         // If login is successful, prepare the response
//         const id = user.UserID;
//         const fn = user.FirstName;
//         const ln = user.LastName;

//         return res.status(200).json({ id, firstName: fn, lastName: ln, error: "" });
//     } catch (err) {
//         console.error(err);
//         error = "An error occurred during login.";
//         return res.status(500).json({ id: -1, firstName: "", lastName: "", error });
//     }
// });

app.post('/api/login', async (req, res) => {
    // Destructure login and password from request body
    const { login, password } = req.body;
    const db = client.db('LargeProject');
    
    try {
        // Look up the user by their login
        const user = await db.collection('users').findOne({ Login: login });
        
        if (!user) {
            // If no user is found, send an error response
            return res.status(404).json({ id: -1, firstName: '', lastName: '', error: 'User not found' });
        }

        // Compare provided password with stored password (assuming bcrypt)
        const isMatch = user.Password === password;  // Adjust if using hashing, e.g., bcrypt.compare(password, user.Password)

        if (!isMatch) {
            // If password doesn't match, send an error response
            return res.status(401).json({ id: -1, firstName: '', lastName: '', error: 'Incorrect password' });
        }

        // If both username and password are correct, return user details
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

// Serve index.html for the root route 
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
