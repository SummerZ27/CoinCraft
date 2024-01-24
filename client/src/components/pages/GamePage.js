import React from "react";
import "./GamePage.css";
import background_photo from "../../public/gameroom_background.png";
import player1 from "../../public/player1.png";
import player2 from "../../public/player2.png";
import player3 from "../../public/player3.png";
import DiceRoller from "../modules/Dice.js";
import dice_rolling from "../../public/DiceRolling.gif";
import "../modules/Dice.css";

const GamePage = ({ userName }) => {
  console.log(userName);
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
      <h3 className="welcomemessage"> Welcome, {userName && <span>{userName}</span>} </h3>
      <img src={player1} className="player1" />;
      <img src={player2} className="player2" />;
      <img src={player3} className="player3" />;
      <body>
        <div className="content">
          <canvas id="canvas"></canvas>
          <div className="ui-controls">
            <div className="score">
              Score: <span id="score-result"></span>
            </div>
            <button id="roll-btn">Throw the dice</button>
          </div>
        </div>
        <DiceRoller />
      </body>
    </div>
  );
};
export default GamePage;
