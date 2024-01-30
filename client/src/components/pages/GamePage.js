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
  const [responseA, setResponseA] = useState(" ");
  const [responseB, setResponseB] = useState(" ");
  const [responseC, setResponseC] = useState(" ");
  let A = 0;
  let B = 0;
  let C = 0;
  let D = 0;
  let spy;
  const countVote = (response) => {
    console.log(response);

    if (response.includes("A")) {
      A++;
    }
    if (response.includes("B")) {
      B++;
    }
    if (response.includes("C")) {
      C++;
    }
    if (response.includes("D")) {
      D++;
    }
  };

  const findspy = (myWord, word1, word2, word3, spy_word) => {
    let spy1;

    if (myWord === spy_word) {
      spy1 = "D";
    }
    if (word1 === spy_word) {
      spy1 = "A";
    }
    if (word2 === spy_word) {
      spy1 = "B";
    }
    if (word3 === spy_word) {
      spy1 = "C";
    }

    return spy1;
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
    }, 2000);
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
    setTimeout(() => {
      setTextBox("You voted A");
      countVote("A");
      vote();
    }, 800);
  };
  const voteB = () => {
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
          setTextBox("Player A votes: " + res.queryresponse.split("%")[1]);
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
          setTextBox("Player B votes: " + res.queryresponse.split("%")[1]);
          countVote(res.queryresponse.split("%")[1]);
          vote3();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 2000);
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
          setTextBox("Player C votes: " + res.queryresponse.split("%")[1]);
          countVote(res.queryresponse.split("%")[1]);
          votingdecision();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 2000);
  };
  const votingdecision = () => {
    setTimeout(() => {
      setTextBox("Counting votes...");
      const numbers = { A, B, C, D };
      const maxNumber = Math.max(A, B, C, D);
      const variablesWithMaxNumber = Object.keys(numbers).filter(
        (key) => numbers[key] === maxNumber
      );

      let selectedVariable;
      if (variablesWithMaxNumber.length > 1) {
        // There is a tie, randomly select one
        selectedVariable =
          variablesWithMaxNumber[Math.floor(Math.random() * variablesWithMaxNumber.length)];
      } else {
        // No tie, just use the single variable with the maximum number
        selectedVariable = variablesWithMaxNumber[0];
      }

      setTextBox(` ${selectedVariable} is voted out`);

      votingvalidate(selectedVariable);
    }, 1000);
  };

  const votingvalidate = (voted) => {
    setTimeout(() => {
      if (spy === "D") {
        if (voted === "D") {
          setTextBox("You are spotted! You lost.");
        } else {
          setTextBox("Player D is the spy. You won!");
        }
      } else {
        if (voted === spy) {
          setTextBox(voted + " is the spy. Good job!");
        } else {
          setTextBox(voted + " is not the spy. You lost.");
        }
      }
    }, 1000);
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
    spy = findspy(myWord, word1, word2, word3, spy_word);
    console.log(spy);
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
