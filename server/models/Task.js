const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Task', taskSchema);