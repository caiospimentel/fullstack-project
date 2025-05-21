require('dotenv').config();
const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const graphqlHandler = require('./graphql');
const { validateAuth, logoutUser } = require('./auth/authController');
const { validateToken } = require('./auth/authMiddleware');
require('./models/Event');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to match your frontend port
  credentials: true
}));
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

// Email testing
app.post('/send-test-email', async (req, res) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'send-email';

    const emailPayload = {
      to: 'recipient@example.com',
      subject: 'Test Email from Docker App',
      text: 'This is a test email sent via RabbitMQ and Email Worker!',
    };

    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailPayload)), { persistent: true });

    console.log('Test email published to queue');
    res.send('Email job sent!');
  } catch (error) {
    console.error('Error publishing email:', error);
    res.status(500).send('Failed to publish email');
  }
});

module.exports = app;