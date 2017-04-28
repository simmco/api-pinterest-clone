var Picture = require("../models/picture");

exports.get = function(req, res) {
  Picture.find({}).populate("poster").then(pics => {
    res.json({ pics });
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
    poster: userId
  });

  newPicture.save().then(pic => res.send(pic)).catch(err => res.send(err));
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

    return pic
      .save()
      .then(val => {
        res.send({ pic, message: "successfully updated" });
      })
      .catch(err => console.log(err));
  });
};

exports.deletePost = function(req, res) {
  var picId = req.params.id;
  var userAuth = req.user._id.toString();
  var userPic = req.body.userId;

    Picture.findById(picId).remove().then(result => {
      res.send({ result, message: "successfully deleted" });
    });
  
};
