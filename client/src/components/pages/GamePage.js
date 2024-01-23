import React from "react";
import "./GamePage.css";
import background_photo from "../../public/gameroom_background.png";
import player1 from "../../public/player1.png";
import player2 from "../../public/player2.png";
import player3 from "../../public/player3.png";
import dice_rolling from "../../public/DiceRolling.gif";
import "../modules/Dice.js";
import "../modules/Dice.css";

const GamePage = () => {
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
      <img src={player1} className="player1" />;
      <img src={player2} className="player2" />;
      <img src={player3} className="player3" />;
      <img src={dice_rolling} className="rollingDice" />;
      <div id="dice-container">
        <canvas id="canvas"></canvas>
        <div id="score-result"></div>
        <button id="roll-btn">Roll Dice</button>
      </div>
    </div>
  );
};
export default GamePage;
