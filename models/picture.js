const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var pictureSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedPics : [String],
  poster: {type:mongoose.Schema.Types.ObjectId, ref:'user'}
})

var Picture = mongoose.model("picture", pictureSchema);

module.exports = Picture;
