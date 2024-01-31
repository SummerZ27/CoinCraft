import React, { useState, useEffect } from "react";
import "./GamePage.css";
import background_photo from "../../public/futuristic.jpg";
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
  let round = 0;
  let responseA = " ";
  let responseB = " ";
  let responseC = " ";
  let responseD = " ";
  let responseD2 = " ";
  let responseA2 = " ";
  let responseB2 = " ";
  let A = 0;
  let B = 0;
  let C = 0;
  let D = 0;
  const [spy, setSpy] = useState("");
  let clickCount = 0;
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
    if (round == 0) {
      setInputText(event.target.value);
      responseD = event.target.value;
    }
    if (round == 1) {
      setInputText(event.target.value);
      responseD2 = event.target.value;
    }
  };

  // Make Query--------------------------------------------------------------------------

  const makeQuery = () => {
    changeTurn();
    changeTurn();
    setTextBox("AI Player A is typing...");
    post("/api/queryA", { descriptionD: responseD, phrase: Word1 })
      .then((res) => {
        setTextBox("Player A: " + res.queryresponse.split("%")[1]);
        responseA = res.queryresponse.split("%")[1];
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
      post("/api/queryB", { descriptionD: responseD, descriptionA: responseA, phrase: Word2 })
        .then((res) => {
          setTextBox("Player B: " + res.queryresponse.split("%")[1]);
          responseB = res.queryresponse.split("%")[1];
          makeQuery3();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 3000);
  };

  const makeQuery3 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player C is typing...");
      console.log(inputText);
      console.log(responseA);
      console.log(responseB);
      post("/api/queryC", {
        descriptionD: inputText,
        descriptionA: responseA,
        descriptionB: responseB,
        phrase: Word3,
      })
        .then((res) => {
          setTextBox("Player C: " + res.queryresponse.split("%")[1]);
          responseC = res.queryresponse.split("%")[1];
          voteprompt();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 3000);
  };
  const secondQuery = () => {
    setTimeout(() => {
      changeTurn();
      changeTurn();
      setTextBox("AI Player A is typing...");
      post("/api/queryA2", {
        descriptionD: responseD,
        descriptionA: responseA,
        descriptionB: responseB,
        descriptionC: responseC,
        descriptionD2: responseD2,
        phrase: Word1,
      })
        .then((res) => {
          setTextBox("Player A:" + res.queryresponse.split("%")[1]);
          responseA2 = res.queryresponse.split("%")[1];
          secondQuery2();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 1000);
  };

  const secondQuery2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player B is typing...");
      post("/api/queryB2", {
        descriptionD: responseD,
        descriptionA: responseA,
        descriptionB: responseB,
        descriptionC: responseC,
        descriptionD2: responseD2,
        descriptionA2: responseA2,
        phrase: Word2,
      })
        .then((res) => {
          setTextBox("Player B:" + res.queryresponse.split("%")[1]);
          responseB2 = res.queryresponse.split("%")[1];
          voteprompt2();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 6000);
  };

  // Vote--------------------------------------------------------------------------

  const voteprompt = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("Now it's time to vote for round one. Who do you think is the spy?");
    }, 3000);
  };
  const voteprompt2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("Now it's time to vote for round two. Who do you think is the spy?");
    }, 3000);
  };
  const voteA = () => {
    setTimeout(() => {
      console.log(round);
      setTextBox("You voted A");
      countVote("A");
      if (round == 0) {
        vote();
        console.log("true");
      } else if (round == 1) {
        console.log("Double true");
        Secondvote();
      }
    }, 800);
  };
  const voteB = () => {
    setTimeout(() => {
      console.log(round);
      setTextBox("You voted B");
      countVote("B");
      if (round == 0) {
        vote();
        console.log("true");
      }
      if (round == 1) {
        Secondvote();
        console.log("Double true");
      }
    }, 800);
  };
  const voteC = () => {
    setTimeout(() => {
      console.log(round);
      setTextBox("You voted C");
      countVote("C");
      if (round == 0) {
        vote();
        console.log("true");
      }
      if (round == 1) {
        Secondvote();
        console.log("Double true");
      }
    }, 800);
  };
  const vote = () => {
    console.log("voted");
    round++;
    setTimeout(() => {
      changeTurn();
      changeTurn();
      setTextBox("AI Player A is voting...");
      post("/api/voteA", {
        descriptionD: responseD,
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
    }, 3000);
  };
  const vote2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player B is voting...");
      post("/api/voteB", {
        descriptionD: responseD,
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
    }, 3000);
  };
  const vote3 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player C is voting...");
      post("/api/voteC", {
        descriptionD: responseD,
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
    }, 3000);
  };

  const Secondvote = () => {
    setTimeout(() => {
      changeTurn();
      changeTurn();
      setTextBox("AI Player 1 is voting...");
      console.log(responseD2, " ", responseA2, " ", responseB2);
      post("/api/voteA2", {
        descriptionD2: responseD2,
        descriptionA2: responseA2,
        descriptionB2: responseB2,
        phrase: Word1,
      })
        .then((res) => {
          setTextBox("Remaining Player 1 votes: " + res.queryresponse.split("%")[1]);
          countVote(res.queryresponse.split("%")[1]);
          Secondvote2();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 3000);
  };

  const Secondvote2 = () => {
    setTimeout(() => {
      changeTurn();
      setTextBox("AI Player 2 is voting...");
      post("/api/voteB2", {
        descriptionD2: responseD2,
        descriptionA2: responseA2,
        descriptionB2: responseB2,
        phrase: Word2,
      })
        .then((res) => {
          setTextBox("Remaining Player 2 votes: " + res.queryresponse.split("%")[1]);
          countVote(res.queryresponse.split("%")[1]);
          votingdecision2();
        })
        .catch(() => {
          setTextBox("error during query. check your server logs!");
        });
    }, 3000);
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

  const votingdecision2 = () => {
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

      votingvalidate2(selectedVariable);
    }, 1000);
  };

  const votingvalidate = (voted) => {
    setTimeout(() => {
      if (voted == "D") {
        if (spy == "D") {
          setTextBox("You are spotted! You lost.");
        } else {
          setTextBox("D is not the spy. " + spy + " is the spy. Human player is out. Game over.");
        }
      } else {
        if (voted == spy) {
          setTextBox(voted + " is the spy. Good job! Game over");
        } else {
          setTextBox(voted + " is not the spy. Next round");
          gameround2(voted);
        }
      }
    }, 1000);
  };
  const votingvalidate2 = (voted) => {
    setTimeout(() => {
      if (voted == "D") {
        if (spy == "D") {
          setTextBox("You are spotted! You lost.");
        } else {
          setTextBox("D is not the spy. " + spy + " is the spy. Game over.");
        }
      } else {
        if (voted == spy) {
          setTextBox(voted + " is the spy. Good job! Game over");
        } else {
          setTextBox(voted + " is not the spy." + spy + " is the spy. Game over.");
          gameround2(voted);
        }
      }
    }, 1000);
  };

  const gameround2 = (voted) => {
    setTimeout(() => {
      A = 0;
      B = 0;
      C = 0;
      D = 0;
      setTextBox(
        "Round 2 " +
          voted +
          " is out. Now let's find the spy out of the remaining three players. Please enter your description below"
      );
      changeTurn();
    }, 1000);
  };

  // Start game--------------------------------------------------------------------------
  const startGameButton = () => {
    round = 0;
    clickCount = 0;
    changeTurn();
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
    setSpy(findspy(myWord, word1, word2, word3, spy_word));
    console.log("myword: " + myWord + " wordA: " + word1 + " wordB: " + word2 + " wordC: " + word3);

    setTimeout(() => {
      setTextBox("Your Word is: " + myWord);
    }, 1200);
    setTimeout(() => {
      setTextBox("Round One. Enter your description in the textbox below.");
    }, 2800);
  };

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
  const descriptionsubmit = () => {
    setInputText(" ");
    if (round === 0) {
      makeQuery();
    } else if (round === 1) {
      secondQuery();
    }
  };
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
      <h1 className="playertags1">Player D</h1>
      <img src={player2} className="player2" id="player2" alt="Player 2" />
      <h1 className="playertags2">Player A</h1>
      <img src={player3} className="player3" id="player3" alt="Player 3" />
      <h1 className="playertags3">Player B</h1>
      <img src={player4} className="player4" id="player4" alt="Player 4" />
      <h1 className="playertags4">Player C</h1>
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
        <button onClick={descriptionsubmit}>Submit</button>
      </div>
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
