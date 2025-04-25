require('dotenv').config();
const express = require('express');
const cors = require('cors');
const graphqlHandler = require('./graphql');
const { validateAuth, logoutUser } = require('./auth/authController');
const { validateToken } = require('./auth/authMiddleware');
require('./models/Event');

const app = express();
app.use(cors());
app.use(express.json());

app.all('/graphql', graphqlHandler);

app.get('/', (req, res) => res.send('API Running 🚀'));

app.get('/api', (req, res) => {
  res.send('Hello from backend 👋');
});

// Auth routes
app.post('/auth/validate', validateAuth)
app.post('/auth/logout', validateToken, logoutUser);

// Protected validation
app.get('/protected', validateToken, (req, res) => {
  res.status(200).json({
    message: 'Hello, authorized user!',
    user: req.user
  });
});

module.exports = app;