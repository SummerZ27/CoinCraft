import React from "react";
import "./Leaderboard.css";
import background_photo from "../../public/LeaderboardBackground.jpg";

const redirectToHome = () => {
  window.location.href = "/";
};

const leaderboard = () => {
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
      <div>
        <button onClick={redirectToHome} className="homeButton">
          Home
        </button>
        <h1 className="title">Leaderboard</h1>
        <h2 className="body">Leader</h2>
      </div>
    </div>
  );
};

export default leaderboard;
