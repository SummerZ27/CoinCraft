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
      <h2 className="body"> Round length: 1-3 minutes.</h2>
      <h2 className="body">
        {" "}
        The players are given a noun to start the game. The noun is the same for the player and AIs
        (e.g., bank) except for one player, who is randomly given the "spy" noun. The spy does not
        know they have a different noun than the other players.
      </h2>
      <h2 className="body">
        {" "}
        The first round begins with players writing a description for their objects. The
        descriptions are read to the large group and players vote on who to eliminate. The player
        with the most votes is eliminated from the game.
      </h2>
      <h2 className="body">
        {" "}
        If the spy or human player are eliminated, the game ends. If neither are eliminated, the
        game continues to a second round where players can rewrite their descriptions and try to
        blend them into the other's original descriptions.
      </h2>
      <h2 className="body">
        {" "}
        The game ends after the second round. If the spy survives both rounds they win. If the
        players eliminate the spy in either round they win the game.
      </h2>
    </div>
  );
};

export default rules;
