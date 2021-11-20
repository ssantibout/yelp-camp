const { text } = require('body-parser');
const { override } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: String,
  rating: Number,
});

module.exports = mongoose.model('Review', reviewSchema);
