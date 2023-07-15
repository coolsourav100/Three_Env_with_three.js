const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Player = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  position: {
    type: [Number],
    default: [0, 0, 0],
  },
  rotation: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('player', Player);

