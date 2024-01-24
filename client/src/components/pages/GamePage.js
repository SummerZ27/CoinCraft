import React from "react";
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
      <img src={player4} className="player4" />;
      <body>
        <div className="content">
          <canvas id="canvas"></canvas>
          <div className="ui-controls">
            <button id="roll-btn">Throw the dice</button>
          </div>
        </div>
        <DiceRoller />
      </body>
    </div>
  );
};
export default GamePage;
