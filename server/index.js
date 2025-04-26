require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('🔴 MongoDB error:', err));