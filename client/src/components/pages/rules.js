import React from "react";
import "./rules.css";
import background_photo from "../../public/RulesBackground.jpg";

const redirectToHome = () => {
  window.location.href = "/";
};

const rules = () => {
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
      <button onClick={redirectToHome} className="homeButton">
        Home
      </button>
      <h1 className="title">Rules</h1>
      <h2 className="body">
        {" "}
        Round length: 6-10 minutes. Shorter for smaller groups, longer for larger.
      </h2>
      <h2 className="body">
        {" "}
        The location: round starts, each player is given a location card. The location is the same
        for all players (e.g., the bank) except for one player, who is randomly given the "spy"
        card. The spy does not know the round's location.
      </h2>
      <h2 className="body">
        {" "}
        Questioning: the game leader (person who started the game) begins by questioning another
        player about the location. Example: ("is this a place where children are welcome?").
      </h2>
      <h2 className="body">
        {" "}
        Answering: the questioned player must answer. No follow up questions allowed. After they
        answer, it's then their turn to ask someone else a question. This continues until round is
        over.
      </h2>
      <h2 className="body">
        {" "}
        No retaliation questions: if someone asked you a question for their turn, you cannot then
        immediately ask them a question back for your turn. You must choose someone else.
      </h2>
    </div>
  );
};

export default rules;
