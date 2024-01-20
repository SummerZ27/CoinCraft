import React from "react";
import "./GamePage.css"
import background_photo from "../../public/Background.jpg";

const GamePage = () => {
  return (
    <div style={{
      backgroundImage: `url(${background_photo})`, 
      margin: 0,
      width: "100%", 
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundSize:"cover"
    }}>
      HIIIIIIIII
    </div>
  );
}
export default GamePage;
