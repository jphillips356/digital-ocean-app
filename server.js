const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


require('dotenv').config();
const url = process.env.MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();


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
    id = results[0].UserId;
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

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.listen(5000); // start Node + Express server on port 5000
