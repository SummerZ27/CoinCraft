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

// router.post("/myWord", (req, res) => {
//   res.send({ success: true });
// });

// router.post("/word1", (req, res) => {
//   res.send({ success: true });
// });

// router.post("/word2", (req, res) => {
//   res.send({ success: true });
// });

// router.post("/word3", (req, res) => {
//   res.send({ success: true });
// });

router.get("/isrunnable", (req, res) => {
  res.send({ isrunnable: ragManager.isRunnable() });
});

router.post("/queryA", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerAtypes(req.body.descriptionD, req.body.phrase);
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/queryB", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerBtypes(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});
router.post("/queryC", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerBtypes(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/queryA2", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerAtypes2(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.descriptionC,
        req.body.descriptionD2,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/queryB2", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerBtypes2(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.descriptionC,
        req.body.descriptionD2,
        req.body.descriptionA2,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/voteA", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerAvotes(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.descriptionC,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/voteB", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerBvotes(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.descriptionC,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/voteC", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerCvotes(
        req.body.descriptionD,
        req.body.descriptionA,
        req.body.descriptionB,
        req.body.descriptionC,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/voteA2", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerAvotes2(
        req.body.descriptionD2,
        req.body.descriptionA2,
        req.body.descriptionB2,
        req.body.phrase
      );
      res.send({ queryresponse });
    } catch (error) {
      console.log("error:", error);
      res.status(500);
      res.send({});
    }
  };
  makeQuery();
});

router.post("/voteB2", (req, res) => {
  const makeQuery = async () => {
    try {
      const queryresponse = await ragManager.PlayerBvotes2(
        req.body.descriptionD2,
        req.body.descriptionA2,
        req.body.descriptionB2,
        req.body.phrase
      );
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
