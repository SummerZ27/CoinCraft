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
    console.log("Game Starts");
    setTextBox("Game Starts");
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
