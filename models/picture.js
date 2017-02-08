const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var pictureSchema = new Schema({
  img: String,
  title: String,
  url: String,
  likes: Number,
  likedPics : [String],
  poster: {type:mongoose.Schema.Types.ObjectId, ref:'user'}
})

var Picture = mongoose.model("picture", pictureSchema);

module.exports = Picture;
