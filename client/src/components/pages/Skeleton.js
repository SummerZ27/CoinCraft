import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import background_photo from "../../public/Background.jpg";
//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID =
  "https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing";

const Skeleton = ({ userId, handleLogin, handleLogout }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* <div> */}
      <img className="background_Container" src={background_photo}></img>
      <div className="bigDiv">
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
      </div>
      {/* </div> */}
    </GoogleOAuthProvider>
  );
};

export default Skeleton;
