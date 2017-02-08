const express = require('express');
const passportService = require('../services/passport');
const passport = require('passport');

var User = require('../models/user');
var Picture = require('../models/picture');

const router = new express.Router();

const requireAuth = passport.authenticate('jwt', { session: false })


router.get('/', function(req, res) {
    Picture.find({})
      .populate('poster')
      .then(pics => {
        res.send({pics});
      })
});


//upload picture
router.post('/picture',requireAuth, function(req, res) {
  var userId = req.user._id;
  var url = req.body.url;
  var title = req.body.title;
  var newPicture = new Picture({
    title: title,
    url: url,
    likes: 0,
    poster: userId
  })

  newPicture.save().then(pic => res.send(pic));
})

//like picture
router.post('/picture/:id', requireAuth, function(req, res) {
    var picId = req.params.id;
    var user = req.user._id;
    Picture.findById(picId)
    .populate('poster')
    .then(pic => {
      var isIndexOf = pic.likedPics.indexOf(user);
      if(isIndexOf !== -1) {
        pic.likedPics.splice(isIndexOf, 1);
        pic.likes = pic.likes - 1;
      } else {
        pic.likedPics.push(user);
        pic.likes = pic.likes + 1;
      }
      pic.save().then(() => {
        res.send({pic, user});
      })
    })
});

router.post('/picture/:id/delete', requireAuth, function(req, res) {
    var picId = req.params.id;
    var userAuth = req.user._id.toString();
    var userPic = req.body.userId;
    console.log(typeof userAuth);
    console.log(typeof userPic);
    if(userAuth === userPic) {
      Picture.findById(picId)
        .remove()
        .then(response =>{
          res.send({picId})
        })
    }

});

//my picture
// router.get("/picture/mypicture", requireAuth, function(req, res) {
//   var user = req.user._id;
//   Picture.find({"poster": user})
//     .populate('poster')
//     .exec(function(err, pics) {
//       if(err)
//         return res.send(err);
//       res.send({pics})
//     })
// });

// user wall
router.get("/picture/:user", function(req, res) {
  var user = req.params.user;
  Picture.find({"poster": user})
    .populate('poster')
    .exec(function(err, pics) {
      if(err)
        return res.send(err);
      res.send({pics})
    })
});

module.exports = router;
