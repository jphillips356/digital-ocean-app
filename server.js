// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { MongoClient, ObjectId } = require('mongodb');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// const url = process.env.MONGODB_URL;
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// let db;

// client.connect()
//   .then(() => {
//     console.log("Connected successfully to MongoDB");
//     db = client.db('LargeProject');
//   })
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Helper function to send email
// async function sendEmail(to, subject, text) {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to,
//       subject,
//       text
//     });
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// // Login route
// app.post('/api/login', async (req, res) => {
//   const { login, password } = req.body;

//   try {
//     const user = await db.collection('users').findOne({
//       $or: [{ Username: login }, { Email: login }]
//     });
    
//     if (!user) {
//       return res.status(404).json({ id: -1, firstName: '', lastName: '', error: 'User not found' });
//     }

//     if (user.Password !== password) {
//       return res.status(401).json({ id: -1, firstName: '', lastName: '', error: 'Incorrect password' });
//     }

//     if (!user.IsVerified) {
//       return res.status(403).json({ id: -1, firstName: '', lastName: '', error: 'Email not verified', needsVerification: true });
//     }
   
//     const { UserID, FirstName, LastName } = user;
//     res.status(200).json({ id: UserID, firstName: FirstName, lastName: LastName, error: '' });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ id: -1, firstName: '', lastName: '', error: 'An error occurred' });
//   }
// });

// // Registration route
// app.post('/api/register', async (req, res) => {
//   const { username, email, password, firstName, lastName } = req.body;
//   try {
//     const usersCollection = db.collection('users');
//     const existingUser = await usersCollection.findOne({ $or: [{ Username: username }, { Email: email }] });
//     if (existingUser) {
//       if (!existingUser.IsVerified) {
//         return res.status(409).json({ success: false, error: 'User exists but is not verified', needsVerification: true });
//       }
//       return res.status(400).json({ success: false, error: 'Username or email already taken' });
//     }
//     const lastUser = await usersCollection.find().sort({ UserID: -1 }).limit(1).toArray();
//     const newUserID = lastUser.length > 0 ? lastUser[0].UserID + 1 : 1;
//     const verificationToken = crypto.randomBytes(20).toString('hex');
//     const newUser = {
//       Username: username,
//       Email: email,
//       Password: password,
//       FirstName: firstName,
//       LastName: lastName,
//       UserID: newUserID,
//       VerificationToken: verificationToken,
//       IsVerified: false
//     };
//     await usersCollection.insertOne(newUser);
    
//     const verificationLink = `http://localhost:5173/api/verify-email?token=${verificationToken}`;
//     await sendEmail(
//       email,
//       'Verify Your Email',
//       `Please click on the following link to verify your email: ${verificationLink}`
//     );
    
//     res.status(201).json({ success: true, error: '', needsVerification: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, error: 'An error occurred during registration' });
//   }
// });

// app.get('/api/verify-email', async (req, res) => {
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).json({ success: false, error: 'Invalid or missing token' });
//   }

//   try {
//     const usersCollection = db.collection('users');
//     const user = await usersCollection.findOne({ VerificationToken: token });

//     if (!user) {
//       return res.status(404).json({ success: false, error: 'Invalid token or user not found' });
//     }

//     // Update the user's IsVerified status
//     await usersCollection.updateOne(
//       { VerificationToken: token },
//       { $set: { IsVerified: true }, $unset: { VerificationToken: '' } } // Remove the token after verification
//     );

//     res.status(200).sendFile(path.join(__dirname, 'success.html')); // Serve a success page
//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({ success: false, error: 'An error occurred during verification' });
//   }
// });


// // Resend verification email route
// app.post('/api/resend-verification', async (req, res) => {
//   const { email } = req.body;
//   try {
//     const usersCollection = db.collection('users');
//     const user = await usersCollection.findOne({ Login: email });
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (user.IsVerified) {
//       return res.status(400).json({ error: 'Email is already verified' });
//     }

//     const verificationToken = crypto.randomBytes(20).toString('hex');
//     await usersCollection.updateOne(
//       { _id: user._id },
//       { $set: { VerificationToken: verificationToken } }
//     );

//     const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
//     await sendEmail(
//       email,
//       'Verify Your Email',
//       `Please click on the following link to verify your email: ${verificationLink}`
//     );

//     res.json({ message: 'Verification email resent successfully' });
//   } catch (error) {
//     console.error('Error resending verification email:', error);
//     res.status(500).json({ error: 'An error occurred while resending the verification email' });
//   }
// });

// // Forgot password route
// app.post('/api/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   try {
//     const usersCollection = db.collection('users');
//     const user = await usersCollection.findOne({ Login: email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const resetToken = crypto.randomBytes(20).toString('hex');
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
//     await usersCollection.updateOne(
//       { _id: user._id },
//       { $set: { ResetToken: resetToken, ResetTokenExpiry: resetTokenExpiry } }
//     );
//     const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
//     await sendEmail(
//       email,
//       'Password Reset Request',
//       `Please click on the following link to reset your password: ${resetLink}`
//     );
//     res.json({ message: 'Password reset email sent' });
//   } catch (error) {
//     console.error('Error in forgot password:', error);
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   }
// });

// // Reset password route
// app.post('/api/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;
//   try {
//     const usersCollection = db.collection('users');
//     const user = await usersCollection.findOne({
//       ResetToken: token,
//       ResetTokenExpiry: { $gt: Date.now() }
//     });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid or expired reset token' });
//     }
//     await usersCollection.updateOne(
//       { _id: user._id },
//       {
//         $set: { Password: newPassword },
//         $unset: { ResetToken: "", ResetTokenExpiry: "" }
//       }
//     );
//     res.json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).json({ error: 'An error occurred while resetting your password' });
//   }
// });

// // Get habits route
// app.get('/api/habits', async (req, res) => {
//   try {
//     const { UserID } = req.query;

//     if (!UserID) {
//       return res.status(400).json({ error: 'UserID is required to fetch habits' });
//     }

//     const habits = await db.collection('habits').find({ UserID: parseInt(UserID) }).toArray();
//     res.json(habits);
//   } catch (error) {
//     console.error('Error fetching habits:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Create habit route
// app.post('/api/habits', async (req, res) => {
//   try {
//     const { name, measurementType, measurementUnit, frequency, goal, UserID } = req.body;

//     if (!UserID) {
//       return res.status(400).json({ error: 'UserID is required to create a habit' });
//     }

//     const habitGoal = goal || 30; // Default goal is 30 if not specified

//     const newHabit = {
//       name,
//       measurementType,
//       measurementUnit,
//       frequency,
//       streak: 0,
//       goal: habitGoal,
//       UserID
//     };

//     const result = await db.collection('habits').insertOne(newHabit);
//     res.status(201).json({ ...newHabit, _id: result.insertedId });
//   } catch (error) {
//     console.error('Error creating habit:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update habit route
// app.put('/api/habits/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, measurementType, measurementUnit, frequency, streak, goal } = req.body;
//     const result = await db.collection('habits').findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: { name, measurementUnit, frequency, streak, goal } },
//       { returnDocument: 'after' }
//     );
//     if (result.value) {
//       res.json(result.value);
//     } else {
//       res.status(404).json({ error: 'Habit not found' });
//     }
//   } catch (error) {
//     console.error('Error updating habit:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Delete habit route
// app.delete('/api/habits/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await db.collection('habits').deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount === 1) {
//       res.json({ message: 'Habit deleted successfully' });
//     } else {
//       res.status(404).json({ error: 'Habit not found' });
//     }
//   } catch (error) {
//     console.error('Error deleting habit:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Complete habit route
// app.put('/api/habits/:id/complete', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const habit = await db.collection('habits').findOne({ _id: new ObjectId(id) });

//     if (!habit) {
//       return res.status(404).json({ error: 'Habit not found' });
//     }

//     const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
//     const currentDate = new Date();

//     if (lastCompletedDate && 
//         lastCompletedDate.getFullYear() === currentDate.getFullYear() &&
//         lastCompletedDate.getMonth() === currentDate.getMonth() &&
//         lastCompletedDate.getDate() === currentDate.getDate()) {
//       return res.status(400).json({ error: 'Habit already completed today' });
//     }

//     const result = await db.collection('habits').findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { 
//         $set: { 
//           lastCompleted: currentDate,
//           streak: habit.streak + 1
//         }
//       },
//       { returnDocument: 'after' }
//     );

//     if (result.value) {
//       res.json(result.value);
//     } else {
//       res.status(404).json({ error: 'Habit not found' });
//     }
//   } catch (error) {
//     console.error('Error completing habit:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Serve index.html for the root route 
// app.get('/', (req, res) => { 
//   res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
//const port = 8080;
const port = 5000; 

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
// app.get('/api/habits', async (req, res) => {
//   try {
//     const habits = await db.collection('habits').find().toArray();
//     res.json(habits);
//   } catch (error) {
//     console.error('Error fetching habits:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/api/habits', async (req, res) => {
  try {
    const { UserID } = req.query;

    if (!UserID) {
      return res.status(400).json({ error: 'UserID is required to fetch habits' });
    }

    const habits = await db.collection('habits').find({ UserID: parseInt(UserID) }).toArray();
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post('/api/habits', async (req, res) => {
//   try {
//     const { name, measurementType, measurementUnit, frequency } = req.body;
//     const newHabit = { name, measurementType, measurementUnit, frequency, streak: 0, goal: 30 };
//     const result = await db.collection('habits').insertOne(newHabit);
//     res.status(201).json({ ...newHabit, _id: result.insertedId });
//   } catch (error) {
//     console.error('Error creating habit:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/api/habits', async (req, res) => {
  try {
    const { name, measurementType, measurementUnit, frequency, goal, UserID } = req.body;

    if (!UserID) {
      return res.status(400).json({ error: 'UserID is required to create a habit' });
    }

    // Set a default goal if one is not provided
    const habitGoal = goal || 30; // Default goal is 30 if not specified

    const newHabit = {
      name,
      measurementType,
      measurementUnit,
      frequency,
      streak: 0,
      goal: habitGoal,
      UserID
    };

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
      { $set: { name, measurementUnit, frequency, streak, goal } },
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

    app.put('/api/habits/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await db.collection('habits').findOne({ _id: new ObjectId(id) });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
    const currentDate = new Date();

    // Check if the habit has already been completed today
    if (lastCompletedDate && 
        lastCompletedDate.getFullYear() === currentDate.getFullYear() &&
        lastCompletedDate.getMonth() === currentDate.getMonth() &&
        lastCompletedDate.getDate() === currentDate.getDate()) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Update the habit
    const result = await db.collection('habits').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          lastCompleted: currentDate,
          streak: habit.streak + 1
        }
      },
      { returnDocument: 'after' }
    );

    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Habit not found' });
    }
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
  // Start server
 // app.listen(port, () => {
   //   console.log(`Server is running on port ${port}`);
 // });