let clickCount = 0;

function changeTurn() {
  clickCount++;
  console.log(clickCount);
  if (clickCount % 4 === 2) {
    var player1Glow = document.getElementById("player1");
    player1Glow.classList.add("changeTurnGlow1");
    var player2Glow = document.getElementById("player2");
    player2Glow.classList.remove("changeTurnGlow2");
    var player3Glow = document.getElementById("player3");
    player3Glow.classList.remove("changeTurnGlow3");
    var player4Glow = document.getElementById("player4");
    player4Glow.classList.remove("changeTurnGlow4");
    var userInput = document.getElementById("user-input");
    userInput.classList.remove("user-input-effect");
  }
  if (clickCount % 4 === 3) {
    var player1Glow = document.getElementById("player1");
    player1Glow.classList.remove("changeTurnGlow1");
    var player2Glow = document.getElementById("player2");
    player2Glow.classList.add("changeTurnGlow2");
    var player3Glow = document.getElementById("player3");
    player3Glow.classList.remove("changeTurnGlow3");
    var player4Glow = document.getElementById("player4");
    player4Glow.classList.remove("changeTurnGlow4");
    var userInput = document.getElementById("user-input");
    userInput.classList.remove("user-input-effect");
  }
  if (clickCount % 4 === 0) {
    var player1Glow = document.getElementById("player1");
    player1Glow.classList.remove("changeTurnGlow1");
    var player2Glow = document.getElementById("player2");
    player2Glow.classList.remove("changeTurnGlow2");
    var player3Glow = document.getElementById("player3");
    player3Glow.classList.add("changeTurnGlow3");
    var player4Glow = document.getElementById("player4");
    player4Glow.classList.remove("changeTurnGlow4");
    var userInput = document.getElementById("user-input");
    userInput.classList.remove("user-input-effect");
  }
  if (clickCount % 4 === 1) {
    var player1Glow = document.getElementById("player1");
    player1Glow.classList.remove("changeTurnGlow1");
    var player2Glow = document.getElementById("player2");
    player2Glow.classList.remove("changeTurnGlow2");
    var player3Glow = document.getElementById("player3");
    player3Glow.classList.remove("changeTurnGlow3");
    var player4Glow = document.getElementById("player4");
    player4Glow.classList.add("changeTurnGlow4");
    var userInput = document.getElementById("user-input");
    userInput.classList.add("user-input-effect");
  }
}

export default changeTurn;
