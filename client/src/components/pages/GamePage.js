import React, { useState } from "react";
import "./GamePage.css";
import background_photo from "../../public/gameroom_background.png";
import player1 from "../../public/players.png";
import player2 from "../../public/players.png";
import player3 from "../../public/players.png";
import player4 from "../../public/players.png";
import "../modules/Dice.css";
import DiceRoller from "../modules/Dice.js";

const GamePage = ({ userName }) => {
  console.log(userName);
  const [inputText, setInputText] = useState("");
  const [textBox, setTextBox] = useState("");
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };
  const handleSubmit = () => {
    console.log("Submitted:", inputText);
  };
  const startGameButton = () => {
    setTextBox("Game Starts");
    const [word1, word2] = getRandomWord();
    console.log(word1);
    setTimeout(() => {
      setTextBox(word1 + " " + word2);
    }, 1200); // 2000 milliseconds (2 seconds) delay
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
      <button onClick={startGameButton}>Start Game</button>
      <img src={player1} className="player1" />;
      <img src={player2} className="player2" />;
      <img src={player3} className="player3" />;
      <img src={player4} className="player4" />;
      <div className="div_sizer">
        <canvas id="canvas" width="100" height="100"></canvas>
        <div className="ui-controls">
          <button id="roll-btn">Throw the dice</button>
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
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default GamePage;
