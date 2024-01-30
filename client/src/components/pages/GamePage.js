import React, { useState, useEffect } from "react";
import "./GamePage.css";
import background_photo from "../../public/gameroom_background.png";
import player1 from "../../public/players.png";
import player2 from "../../public/players.png";
import player3 from "../../public/players.png";
import player4 from "../../public/players.png";
import "../modules/Dice.css";
import DiceRoller from "../modules/Dice.js";
import getRandomWord from "../modules/getword.js";
import { get, post } from "../../utilities";

const GamePage = ({ userName }) => {
  const [inputText, setInputText] = useState("");
  const [textBox, setTextBox] = useState("");
  const [MyWord, setMyWord] = useState(" ");
  const [Word1, setWord1] = useState(" ");
  const [Word2, setWord2] = useState(" ");
  const [Word3, setWord3] = useState(" ");
  const [myVote, setMyVote] = useState(" ");
  const [responseA, setResponseA] = useState(" ");
  const [responseB, setResponseB] = useState(" ");
  const [responseC, setResponseC] = useState(" ");
  const [votesforA, setVotesforA] = useState(0);
  const [votesforB, setVotesforB] = useState(0);
  const [votesforC, setVotesforC] = useState(0);
  const [votesforD, setVotesforD] = useState(0);

  const countVote = (response) => {
    console.log(response);

    if (response.includes("A")) {
      const prevVotesforA = votesforA;
      setVotesforA(prevVotesforA + 1);
    }
    if (response.includes("B")) {
      const prevVotesforB = votesforB;
      setVotesforB(prevVotesforB + 1);
    }
    if (response.includes("C")) {
      const prevVotesforC = votesforC;
      setVotesforC(prevVotesforC + 1);
    }
    if (response.includes("D")) {
      const prevVotesforD = votesforD;
      setVotesforD(prevVotesforD + 1);
    }
  };

  let rollingState = {
    isRolling: false,
  };
  const roll = () => {
    rollingState.isRolling = true;
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Make Query--------------------------------------------------------------------------

  const makeQuery = () => {
    changeTurn();
    changeTurn();
    setTextBox("AI Player A is typing...");
    post("/api/queryA", { descriptionD: inputText, phrase: Word1 })
      .then((res) => {
        setTextBox("Player A:" + res.queryresponse.split("%")[1]);
        setResponseA(res.queryresponse.split("%")[1]);
        makeQuery2();
      })
      .catch(() => {
        setTextBox("error during query. check your server logs!");
      });
  };

  const makeQuery2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player B is typing...");
      post("/api/queryB", { descriptionD: inputText, descriptionA: responseA, phrase: Word2 })
        .then((res) => {
          setTextBox("Player B:" + res.queryresponse.split("%")[1]);
          setResponseB(res.queryresponse.split("%")[1]);
          makeQuery3();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 2000); // 1200 milliseconds (1.2 seconds) delay
  };

  const makeQuery3 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player C is typing...");
      post("/api/queryC", {
        descriptionD: inputText,
        descriptionA: responseA,
        descriptionB: responseB,
        phrase: Word3,
      })
        .then((res) => {
          setTextBox("Player C:" + res.queryresponse.split("%")[1]);
          setResponseC(res.queryresponse.split("%")[1]);
          voteprompt();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 2000); // 1200 milliseconds (1.2 seconds) delay
  };

  // Vote--------------------------------------------------------------------------

  const voteprompt = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("Now it's time to vote. Who do you think is the spy?");
    }, 3000); // 1200 milliseconds (1.2 seconds) delay
  };
  const voteA = () => {
    setMyVote("A");
    setTimeout(() => {
      setTextBox("You voted A");
      countVote("A");
      vote();
    }, 800);
  };
  const voteB = () => {
    setMyVote("B");
    setTimeout(() => {
      setTextBox("You voted B");
      countVote("B");
      vote();
    }, 800);
  };
  const voteC = () => {
    setTimeout(() => {
      setTextBox("You voted C");
      countVote("C");
      vote();
    }, 800);
  };
  const vote = () => {
    setTimeout(() => {
      changeTurn();
      changeTurn();
      setTextBox("AI Player A is voting...");
      post("/api/voteA", {
        descriptionD: inputText,
        descriptionA: responseA,
        descriptionB: responseB,
        descriptionC: responseC,
        phrase: Word1,
      })
        .then((res) => {
          setTextBox("Player A votes: " + res.queryresponse.split("%")[1] + res.queryresponse);
          countVote(res.queryresponse.split("%")[1]);
          vote2();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 2000); // 1200 milliseconds (1.2 seconds) delay
  };
  const vote2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player B is voting...");
      post("/api/voteB", {
        descriptionD: inputText,
        descriptionA: responseA,
        descriptionB: responseB,
        descriptionC: responseC,
        phrase: Word2,
      })
        .then((res) => {
          setTextBox("Player B votes: " + res.queryresponse.split("%")[1] + res.queryresponse);
          countVote(res.queryresponse.split("%")[1]);
          vote3();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 5000); // 1200 milliseconds (1.2 seconds) delay
  };
  const vote3 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player C is voting...");
      post("/api/voteC", {
        descriptionD: inputText,
        descriptionA: responseA,
        descriptionB: responseB,
        descriptionC: responseC,
        phrase: Word3,
      })
        .then((res) => {
          setTextBox("Player C votes: " + res.queryresponse.split("%")[1] + res.queryresponse);
          countVote(res.queryresponse.split("%")[1]);
          votingdecision();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 5000); // 1200 milliseconds (1.2 seconds) delay
  };
  const votingdecision = () => {
    setTimeout(() => {
      setTextBox("Counting votes...");
      const numbers = { votesforA, votesforB, votesforC, votesforD };
      console.log(numbers);
      const maxNumber = Math.max(votesforA, votesforB, votesforC, votesforD);
      const variableWithMaxNumber = Object.keys(numbers).find((key) => numbers[key] === maxNumber);
      return { maxNumber, variable: variableWithMaxNumber };
    }, 1000); // 1200 milliseconds (1.2 seconds) delay
  };
  // Start game--------------------------------------------------------------------------
  const startGameButton = () => {
    var userInput = document.getElementById("user-input");
    userInput.classList.add("user-input-effect");
    var startGlowGreen = document.getElementById("start");
    startGlowGreen.classList.toggle("start_bright");
    setTextBox("Game Starts");
    const [word, spy_word] = getRandomWord();
    const wordsArray = [word, word, word, spy_word];
    const shuffledWords = wordsArray.sort(() => Math.random() - 0.5);
    const [myWord, word1, word2, word3] = shuffledWords;
    setMyWord(myWord);
    setWord1(word1);
    setWord2(word2);
    setWord3(word3);
    console.log("myword: " + myWord + " wordA: " + word1 + " wordB: " + word2 + " wordC: " + word3);

    setTimeout(() => {
      setTextBox("Your Word is: " + myWord);
    }, 1200); // 1200 milliseconds (1.2 seconds) delay

    const roundOneDelay = 2800;
    setTimeout(() => {
      setTextBox("Round One. Enter your description in the textbox below.");
    }, roundOneDelay);
  };
  let clickCount = 0;

  // change turn--------------------------------------------------------------------------

  function changeTurn() {
    clickCount++;
    //   console.log(clickCount);
    if (clickCount % 4 === 2) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.add("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
      var userInput = document.getElementById("user-input");
      userInput.classList.remove("user-input-effect");
    }
    if (clickCount % 4 === 3) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.add("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
      var userInput = document.getElementById("user-input");
      userInput.classList.remove("user-input-effect");
    }
    if (clickCount % 4 === 0) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.add("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
      var userInput = document.getElementById("user-input");
      userInput.classList.remove("user-input-effect");
    }
    if (clickCount % 4 === 1) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.add("changeTurnGlow4");
      var userInput = document.getElementById("user-input");
      userInput.classList.add("user-input-effect");
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${background_photo})`,
        margin: 0,
        width: "100%",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="textbox">{textBox}</div>
      <button onClick={startGameButton} className="start" id="start">
        Start Game
      </button>
      <img src={player1} className="player1" id="player1" alt="Player 1" />
      <img src={player2} className="player2" id="player2" alt="Player 2" />
      <img src={player3} className="player3" id="player3" alt="Player 3" />
      <img src={player4} className="player4" id="player4" alt="Player 4" />
      <div className="div_sizer">
        <canvas id="canvas" width="100" height="100"></canvas>
        <div className="ui-controls">
          {/* <button onClick={roll} id="roll-btn" className="roll-btn">
            Throw the dice
          </button> */}
        </div>
      </div>
      <DiceRoller />
      <div className="user-input" id="user-input">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Describe your phrase..."
        />
        <button onClick={makeQuery}>Submit</button>
      </div>
      {/* <button onClick={changeTurn} className="changeTurn" id="changeTurn">
        Change Turn
      </button> */}
      <button onClick={voteA} className="voteA">
        A
      </button>
      <button onClick={voteB} className="voteB">
        B
      </button>
      <button onClick={voteC} className="voteC">
        C
      </button>
    </div>
  );
};

export default GamePage;
