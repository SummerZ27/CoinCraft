import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import { get, post } from "../../utilities.js";
import "./Skeleton.css";
import background_photo from "../../public/Background.jpg";
const GOOGLE_CLIENT_ID = "819648348238-uvbmrkooo5ccovnco5mtr19mc8lkub17.apps.googleusercontent.com";

const Skeleton = () => {
  const [loggedIn, setloggedIn] = useState(null);

  // useEffect(() => {
  //   get("/api/whoami").then((user) => {
  //     if (user._id) {
  //       // they are registed in the database, and currently logged in.
  //       setUserId(user._id);
  //     }
  //   });
  // }, []);

  const redirectToGamePage = () => {
    window.location.href = "/GamePage";
  };

  const handleLogin = (res) => {
    // 'res' contains the response from Google's authentication servers
    console.log(res);
    setloggedIn(true);
    //const userToken = res.tokenObj.id_token;
    // post("/api/login", { token: userToken }).then((user) => {
    //   // the server knows we're logged in now
    //   setUserId(user._id);
    //   console.log(user);
    // });
  };

  const handleLogout = () => {
    console.log("Logged out successfully!");
    post("/api/logout");
    setloggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
        {loggedIn ? (
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

        <h1 className="game_Title"> AI Spyfall </h1>
        <h2 className="game_Subtitle"> Uncover the spy in this thrilling, deceptive game! </h2>
        <div className="container">
          <button onClick={redirectToGamePage} className="getStartedButton">
            Go to GamePage
          </button>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Skeleton;
