const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },

  comment: {
    type: String,
  },
})

module.exports = mongoose.model('Comment', commentSchema)
