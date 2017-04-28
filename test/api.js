process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Picture = require("../models/picture");
let User = require("../models/user");

let chai = require("chai");
let chaitHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

mongoose.Promise = global.Promise;

chai.use(chaitHttp);

describe("Picture", () => {
  let token;
  let userAccountForTesting = {
    email: "test@test.com",
    username: "test",
    password: "test123"
  };

  before(done => {
    User.remove({}).then(() => done());
  });

  beforeEach(done => {
    Picture.remove({}, err => {
      done();
    });
  });

  describe("/AUTH ", () => {
    it("User should be able to signup", done => {
      chai
        .request(server)
        .post("/auth/signup")
        .send(userAccountForTesting)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("username");
          res.body.should.have.property("id");
          res.body.token.should.be.a("string");
          done();
        });
    });

    it("User should signin and generate a token", done => {
      chai
        .request(server)
        .post("/auth/signin")
        .send(userAccountForTesting)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("username");
          res.body.should.have.property("id");
          res.body.token.should.be.a("string");
          token = res.body.token;
          done();
        });
    });
  });

  describe("/GET picture", () => {
    it("it should GET all the pictures", done => {
      chai.request(server).get("/api").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.be.emty;
        done();
      });
    });
  });

  describe("/POST picture", () => {
    it("it should not POST a book without title field", done => {
      const picture = {
        url: "https://dummy.com"
      };
      chai
        .request(server)
        .post("/api/picture")
        .set("authorization", token)
        .send(picture)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("title");
          res.body.errors.title.should.have.property("kind").eql("required");
          done();
        });
    });

    it("it should POST a book ", done => {
      const picture = {
        url: "https://dummy.com",
        title: "the wonderful dummy"
      };
      chai
        .request(server)
        .post("/api/picture")
        .set("authorization", token)
        .send(picture)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title").eql("the wonderful dummy");
          res.body.should.have.property("url");
          res.body.should.have.property("likes");
          res.body.should.have.property("poster");
          res.body.should.have.property("likedPics");
          done();
        });
    });
  });

  describe("/GET/:user", () => {
    it("it should GET a book by the given id", done => {
      const user = new User({
        email: "dummy@dummy.com",
        username: "dummy",
        password: "dummy123"
      });
      user.save((err, user) => {
        const picture = new Picture({
          url: "https://dummy.com",
          title: "the wonderful dummy",
          poster: user._id
        });

        picture.save().then(pic => {
          chai.request(server).get("/api/user/" + user._id).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.pics[0].should.have.property("title");
            res.body.pics[0].should.have.property("url");
            done();
          });
        });
      });
    });
  });

  describe("/PATCH/picture/:id picture", () => {
    it("it should UPDATE a picture if a LIKE is given", done => {
      let picture = new Picture({
        url: "https://dummy.com",
        title: "the wonderful dummy"
      });
      picture.save().then(pic => {
        chai
          .request(server)
          .patch("/api/picture/" + pic._id)
          .set("authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.pic.should.have.property("likes").eql(1);
            res.body.pic.likedPics.should.have.lengthOf(1);
            done();
          });
      });
    });
  });

  describe("/DELETE/:id book", () => {
    it("it should DELETE a book given the id", done => {
      let picture = new Picture({
        url: "https://dummy.com",
        title: "the wonderful dummy"
      });
      picture.save((err, book) => {
        chai
          .request(server)
          .delete("/api//picture/" + book.id)
          .set("authorization", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("successfully deleted");
            res.body.result.should.have.property("ok").eql(1);
            res.body.result.should.have.property("n").eql(1);
            done();
          });
      });
    });
  });
});
