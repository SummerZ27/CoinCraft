/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Document = require("./models/document");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const ragManager = require("./rag");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.post("/mydescription", (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).send({ error: "User not logged in" });
  }
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { description: req.body.description }, (err, user) => {
    if (err) {
      console.error("Error updating user description:", err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
    res.send({ success: true });
  });
});

router.post("/myWord", (req, res) => {
  res.send({ success: true });
});

router.post("/word1", (req, res) => {
  res.send({ success: true });
});

router.post("/word2", (req, res) => {
  res.send({ success: true });
});

router.post("/word3", (req, res) => {
  res.send({ success: true });
});

router.get("/isrunnable", (req, res) => {
  res.send({ isrunnable: ragManager.isRunnable() });
});

router.post("/document", (req, res) => {
  const newDocument = new Document({
    content: req.body.content,
  });

  const addDocument = async (document) => {
    try {
      await document.save();
      await ragManager.addDocument(document);
      res.send(document);
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };

  addDocument(newDocument);
});

router.get("/document", (req, res) => {
  Document.find({}).then((documents) => res.send(documents));
});

router.post("/query", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.retrievalAugmentedGeneration(req.body.query);
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
