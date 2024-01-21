import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import background_photo from "../../public/Background.jpg";
//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID =
  "https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing";

const Skeleton = ({ userId, handleLogin, handleLogout }) => {
  const redirectToGamePage = () =>{
    // Use window.location.href to change the current URL
    window.location.href = "/GamePage";
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{
        backgroundImage: `url(${background_photo})`, 
        margin: 0,
        width: "100%", 
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}>
          {userId ? (
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          )}

          <h1 className="game_Title"> AI Spyfall </h1>
          <h2 className="game_Subtitle"> Uncover the spy in this thrilling, deceptive game! </h2>
          <div className="container">
            <button onClick={redirectToGamePage} className="getStartedButton">Go to GamePage</button>
          </div>

        </div>
    </GoogleOAuthProvider>
  );
};

export default Skeleton;
