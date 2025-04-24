require('dotenv').config();
const express = require('express');
const cors = require('cors');
const graphqlHandler = require('./graphql');
require('./models/Event');

const app = express();
app.use(cors());
app.use(express.json());

app.all('/graphql', graphqlHandler);

app.get('/', (req, res) => res.send('API Running 🚀'));

app.get('/api', (req, res) => {
    res.send('Hello from backend 👋');
  });

module.exports = app;