import React from "react";
import { useHistory } from "react-router-dom";
import background_photo from "../../public/HomeBackground.jpg";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import "./LoginPage.css";
const GOOGLE_CLIENT_ID = "819648348238-uvbmrkooo5ccovnco5mtr19mc8lkub17.apps.googleusercontent.com";

const LoginPage = ({ handleLogin }) => {
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
        <h1 className="game_Subtitle">Please Log in First!</h1>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={handleLogin}
          onFailure={(err) => console.log(err)}
          redirectUri="/GamePage" // Set the redirectUri to the desired page after successful login
          scope="openid profile"
          className="googleButton"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
