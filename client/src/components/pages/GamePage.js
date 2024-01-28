import React, { useState, useEffect } from "react";
import "./GamePage.css";
import background_photo from "../../public/gameroom_background.png";
import player1 from "../../public/players.png";
import player2 from "../../public/players.png";
import player3 from "../../public/players.png";
import player4 from "../../public/players.png";
import "../modules/Dice.css";
import DiceRoller from "../modules/Dice.js";

const GamePage = ({ userName }) => {
  let rollingState = {
    isRolling: false,
  };
  const roll = () => {
    rollingState.isRolling = true;
  };
  let clickCount = 0;
  const changeTurn = () => {
    clickCount++;
    console.log(clickCount);
    if (clickCount % 4 === 0) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.add("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
    }
    if (clickCount % 4 === 1) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.add("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
    }
    if (clickCount % 4 === 2) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.add("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.remove("changeTurnGlow4");
    }
    if (clickCount % 4 === 3) {
      var player1Glow = document.getElementById("player1");
      player1Glow.classList.remove("changeTurnGlow1");
      var player2Glow = document.getElementById("player2");
      player2Glow.classList.remove("changeTurnGlow2");
      var player3Glow = document.getElementById("player3");
      player3Glow.classList.remove("changeTurnGlow3");
      var player4Glow = document.getElementById("player4");
      player4Glow.classList.add("changeTurnGlow4");
    }
  };
  console.log(userName);
  const [inputText, setInputText] = useState("");
  const [textBox, setTextBox] = useState("");
  const [descriptionSubmitted, setDescriptionSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const descriptionSubmit = () => {
    setDescriptionSubmitted(true);
    setTextBox("Your description: " + inputText);
    // Send input text to 'api/mydescription'
    fetch("api/mydescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: inputText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Description submitted:", data);
      })
      .catch((error) => {
        console.error("Error submitting description:", error);
      });
  };

  const startGameButton = () => {
    var startGlowGreen = document.getElementById("start");
    startGlowGreen.classList.toggle("start_bright");
    setTextBox("Game Starts");
    const [word, spy_word] = getRandomWord();
    const wordsArray = [word, word, word, spy_word];
    const shuffledWords = wordsArray.sort(() => Math.random() - 0.5);
    const [myWord, word1, word2, word3] = shuffledWords;
    fetch("api/myWord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: myWord }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("myWord submitted:", data);
      })
      .catch((error) => {
        console.error("Error submitting myWord:", error);
      });

    [word1, word2, word3].forEach((word, index) => {
      fetch(`api/word${index + 1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(`word${index + 1} submitted:`, data);
        })
        .catch((error) => {
          console.error(`Error submitting word${index + 1}:`, error);
        });
    });

    setTimeout(() => {
      setTextBox("Your Word is: " + myWord);
    }, 1200); // 1200 milliseconds (1.2 seconds) delay

    const roundOneDelay = 2800;
    setTimeout(() => {
      setTextBox("Round One. Enter your description in the textbox below.");
    }, roundOneDelay);

    if (descriptionSubmitted) {
      setTextBox("Description submitted");
    }
  };

  function getRandomWord() {
    const words = ["apple", "moon", "ocean", "car", "violin", "bike", "apartment", "cat"];
    const spy_words = ["orange", "sun", "river", "truck", "cello", "scooter", "house", "dog"];
    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("The word list must be a non-empty array.");
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    return [words[randomIndex], spy_words[randomIndex]];
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
          <button onClick={roll} id="roll-btn" className="roll-btn">
            Throw the dice
          </button>
        </div>
      </div>
      <DiceRoller />
      <div className="user-input">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Describe your phrase..."
        />
        <button onClick={descriptionSubmit}>Submit</button>
      </div>
      <button onClick={changeTurn} className="changeTurn" id="changeTurn">
        Change Turn
      </button>
    </div>
  );
};

export default GamePage;
