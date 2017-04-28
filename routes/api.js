const express = require("express");
const passport = require("passport");

const pictureController = require("../controllers/pictureController");

const router = new express.Router();

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/", pictureController.get);
router.get("/user/:user", pictureController.getUser);
router.post("/picture", requireAuth,  pictureController.post);
router.patch("/picture/:id", requireAuth, pictureController.likePost);
router.delete("/picture/:id", requireAuth, pictureController.deletePost);

module.exports = router;
