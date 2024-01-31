import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import { get, post } from "../../utilities.js";
import "./Skeleton.css";
import background_photo from "../../public/HomeBackground.jpg";
const GOOGLE_CLIENT_ID = "819648348238-uvbmrkooo5ccovnco5mtr19mc8lkub17.apps.googleusercontent.com";

const redirectToRules = () => {
  window.location.href = "/rules";
};
const redirectToLeaderboard = () => {
  window.location.href = "/leaderboard";
};

const Skeleton = ({ handleLogin, handleLogout, userId }) => {
  const redirectToGamePage = () => {
    if (userId) {
      window.location.href = "/GamePage";
    } else {
      window.location.href = "/LoginPage";
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          backgroundImage: `url(${background_photo})`,
          margin: 0,
          width: "100%",
          height: "101vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {userId ? (
          <button
            className="logoutbutton"
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={handleLogin}
            onFailure={(err) => console.log(err)}
            scope="openid profile"
          />
        )}
        <div className="game_Title_div">
          <h1 className="game_Title" data-text="&nbsp;AI Spyfall&nbsp;">
            &nbsp;AI Spyfall&nbsp;
          </h1>
        </div>
        <h2 className="game_Home_Subtitle"> Uncover Spies in Thrilling Game! </h2>
        <div className="container">
          <button onClick={redirectToGamePage} className="getStartedButton">
            Go to GamePage
          </button>
          <button onClick={redirectToRules} className="rulesButton">
            Rules
          </button>
          <button onClick={redirectToLeaderboard} className="leaderboardButton">
            Leaderboard
          </button>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Skeleton;
