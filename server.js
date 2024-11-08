// // Import required modules
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');
// const MongoClient = require('mongodb').MongoClient;
// require('dotenv').config();

// // Initialize Express app
// const app = express();
// const port = 8080;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// // app.use(express.static(path.join(__dirname, 'frontend')));
// app.use(express.static(path.join(__dirname, 'frontend/dist')));

// app.get('*', (req, res) => { 
//    res.sendFile(path.join(__dirname, 'frontend/dist', 'frontend/dist/index.html')); 
// });

// // MongoDB connection
// const url = process.env.MONGODB_URL;
// //const url = 'mongodb+srv://jishdotcom:COP4331IsCool@cluster0.rqrdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//     if (err) {
//         console.error("MongoDB connection failed:", err);
//         process.exit(1); // Exit if there is a connection error
//     }
//     console.log("MongoDB connected successfully");
// });


// app.post('/api/login', async (req, res) => {
//     // Incoming: login, password
//     const { login, password } = req.body;

//     try {
//         const db = client.db('LargeProject');
        
//         // Check if user exists by login
//         const user = await db.collection('users').findOne({ Login: login });

//         if (!user) {
//             // User not found
//             return res.status(404).json({ id: -1, firstName: '', lastName: '', error: 'User not found' });
//         }

//         // Check if password matches
//         if (user.Password !== password) {
//             // Password does not match
//             return res.status(401).json({ id: -1, firstName: '', lastName: '', error: 'Incorrect password' });
//         }

//         // Successful login
//         const { UserID, FirstName, LastName } = user;
//         res.status(200).json({ id: UserID, firstName: FirstName, lastName: LastName, error: '' });
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ id: -1, firstName: '', lastName: '', error: 'An error occurred' });
//     }
// });


// app.post('/api/register', async (req, res) => {
//     let error = '';
//     // Destructure the incoming request
//     const { login, password, firstName, lastName } = req.body;
//     try {
//         const db = client.db('LargeProject');
//         const usersCollection = db.collection('users');
//         // Check if the login already exists
//         const existingUser = await usersCollection.findOne({ Login: login });
//         if (existingUser) {
//             error = 'Username already taken';
//             return res.status(400).json({ success: false, error });
//         }
//         // Generate a new UserID (assuming it’s the next sequential ID)
//         const lastUser = await usersCollection.find().sort({ UserID: -1 }).limit(1).toArray();
//         const newUserID = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;
//         // Insert the new user
//         const newUser = {
//             Login: login,
//             Password: password, // Note: Hashing is recommended here for security.
//             FirstName: firstName,
//             LastName: lastName,
//             UserID: newUserID
//         };
//         await usersCollection.insertOne(newUser);
//         // Respond with success message
//         res.status(201).json({ success: true, error: '' });
//     } catch (e) {
//         console.error(e);
//         error = 'An error occurred during registration';
//         res.status(500).json({ success: false, error });
//     }
// });

// // Serve index.html for the root route 
// app.get('/', (req, res) => { 
//   res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
//   });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 5173;

// Middleware
app.use(cors());
app.set('port', (process.env.PORT || 8080));



// const express = require('express');
// const path = require('path');
//const app = express();

if (process.env.NODE_ENV === 'production') {
    // Set static folder to 'frontend/dist' in production
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    // Serve index.html for any route to support client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
} else {
    // Set static folder to 'frontend' in development
    app.use(express.static(path.join(__dirname, 'frontend')));

    // Serve index.html for any route to support client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
    });
}


//app.use(express.static(staticPath));

// MongoDB connection
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

client.connect(err => {
    if (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Exit if there is a connection error
    }
    console.log("MongoDB connected successfully");
});

// API Endpoints

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const db = client.db('LargeProject');
        const user = await db.collection('users').findOne({ Login: login });

        if (!user) {
            return res.status(404).json({ id: -1, firstName: '', lastName: '', error: 'User not found' });
        }

        if (user.Password !== password) {
            return res.status(401).json({ id: -1, firstName: '', lastName: '', error: 'Incorrect password' });
        }

        const { UserID, FirstName, LastName } = user;
        res.status(200).json({ id: UserID, firstName: FirstName, lastName: LastName, error: '' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ id: -1, firstName: '', lastName: '', error: 'An error occurred' });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { login, password, firstName, lastName } = req.body;
    try {
        const db = client.db('LargeProject');
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ Login: login });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username already taken' });
        }

        const lastUser = await usersCollection.find().sort({ UserID: -1 }).limit(1).toArray();
        const newUserID = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;

        const newUser = {
            Login: login,
            Password: password, // Note: Hashing is recommended here for security.
            FirstName: firstName,
            LastName: lastName,
            UserID: newUserID
        };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ success: true, error: '' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: 'An error occurred during registration' });
    }
});

// Fallback for client-side routing (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



//json code:

// {
//     "name": "backend",
//     "version": "1.0.0",
//     "description": "",
//     "main": "server.js",
//     "scripts": {
//       "test": "echo \"Error: no test specified\" && exit 1",
//       "start": "NODE_ENV=development nodemon server.js",
//       "start:prod": "NODE_ENV=production node server.js",
//       "build": "tsc -b && vite build"
//     },
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//       "bcrypt": "^5.1.1",
//       "body-parser": "^1.20.3",
//       "cors": "^2.8.5",
//       "dotenv": "^16.4.5",
//       "express": "^4.21.0",
//       "mongodb": "^5.9.2",
//       "react-router-dom": "^6.27.0"
//     },
//     "devDependencies": {
//       "@types/react": "^18.3.12",
//       "@types/react-dom": "^18.3.1",
//       "nodemon": "^3.1.7",
//       "vite": "^5.4.10"
//     }
//   }
  