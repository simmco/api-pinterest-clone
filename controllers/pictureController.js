var Picture = require("../models/picture");

exports.get = function(req, res) {
  Picture.find({}).populate("poster").then(pics => {
    res.send({ pics });
  });
};

exports.getUser = function(req, res) {
  var user = req.params.user;
  Picture.find({ poster: user }).populate("poster").exec(function(err, pics) {
    if (err) return res.send(err);
    res.send({ pics });
  });
};

exports.post = function(req, res) {
  var userId = req.user._id;
  var url = req.body.url;
  var title = req.body.title;
  var newPicture = new Picture({
    title: title,
    url: url,
    likes: 0,
    poster: userId
  });

  newPicture.save().then(pic => res.send(pic));
};

exports.likePost = function(req, res) {
  var picId = req.params.id;
  var user = req.user._id;

  Picture.findById(picId).populate("poster").then(pic => {
    var isIndexOf = pic.likedPics.indexOf(user);
    if (isIndexOf !== -1) {
      pic.likedPics.splice(isIndexOf, 1);
      pic.likes = pic.likes - 1;
    } else {
      pic.likedPics.push(user);
      pic.likes = pic.likes + 1;
    }
    pic.save().then(() => {
      res.send({ pic, user });
    });
  });
};

exports.deletePost = function(req, res) {
  var picId = req.params.id;
  var userAuth = req.user._id.toString();
  var userPic = req.body.userId;
  if (userAuth === userPic) {
    Picture.findById(picId).remove().then(response => {
      res.send({ picId });
    });
  }
};
