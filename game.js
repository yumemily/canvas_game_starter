/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

let b;
let bulletFire = false;
let isPlaying = false
let myTime; //timer for the scrolling bg
let life = 3;
let score = 0;
let highScore = 0;
let roundNumber = 0;


let playerName = document.getElementById("userName");
let submitButton = document.getElementById("submitButton");
let yourGameHistory = document.getElementById("yourGameHistory");
let resetBtn = document.getElementById("resetBtn");
let submitScore = document.getElementById("submitScore");
let scoreDisplay = document.getElementById('score');
let startgame = document.getElementById("start-game");

submitScore.addEventListener("click", name);
startgame.addEventListener("click", game);
resetBtn.addEventListener("click", playAgain);
submitScore.addEventListener("click", scoreSubmit);


function name() {
  playerInfo.innerHTML = `Player Name: ${playerName.value}`;
}

//Initial positions
let heroX = 60;
let heroY = 340;

let firstLeafX = 500;
let firstLeafY = 20;

let secondLeafX = 560;
let secondLeafY = 20;

let thirdLeafX = 620;
let thirdLeafY = 20;

let bulletX;
let bulletY;

let tomX = 400;
let tomY = 340;

let isabelleX = 590;
let isabelleY = 290;

let decorX = 200;
let decorY = 50;

let loseX = -30;
let loseY = -100;


/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var image = new Image();
image.src = 'https://image.freepik.com/free-vector/pixel-8-bit-game-background-with-ground-cloudy-sky-panorama_53562-3520.jpg';

canvas.width = 700;
canvas.height = 480;

ctx.font = "30px Verdana";

let bgReady, heroReady, bulletReady, tomReady, isabelleReady, decorReady, firstLeafReady, secondLeafReady, thirdLeafReady, loseReady;
let bgImage, heroImage, bulletImage, tomImage, isabelleImage, decorImage, firstLeafImage, secondLeafImage, thirdLeafImage, loseImage;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };

  //scrolling background
  image.onload = function () {
    var x = 0;
    var width = image.width;
    var min = 0 - width;
    var step = 1;

    var loop = function () {
      ctx.drawImage(image, x, 0);
      ctx.drawImage(image, x + width, 0);
      x -= step;
      if (x < min) {
        x = 0;
      }
    };
    myTime = setInterval(loop, 1000 / 40);
  };

  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/villager-transparent-2.png";

  bulletImage = new Image();
  bulletImage.onload = function () {
    // show the monster image
    bulletReady = true;
  };
  bulletImage.src = "images/bowlingball.png";

  //tomNook Image
  tomImage = new Image();
  tomImage.onload = function () {
    //show the pipe image
    tomReady = true;
  };
  tomImage.src = "images/tomnook-transparent.png";

  //isabelle Image
  isabelleImage = new Image();
  isabelleImage.onload = function () {
    // show Isabelle image
    isabelleReady = true;
  };
  isabelleImage.src = "images/isabelle-transparent.png";

  //decor Image
  decorImage = new Image();
  decorImage.onload = function () {
    decorReady = true;
  };
  decorImage.src = "images/bee.png";

  //First Leaf Image
  firstLeafImage = new Image();
  firstLeafImage.onload = function () {
    firstLeafReady = true;
  };
  firstLeafImage.src = "images/leaf.png";

  //Second Leaf Image
  secondLeafImage = new Image();
  secondLeafImage.onload = function () {
    secondLeafReady = true;
  };
  secondLeafImage.src = "images/leaf.png";

  //Third Leaf Image
  thirdLeafImage = new Image();
  thirdLeafImage.onload = function () {
    thirdLeafReady = true;
  };
  thirdLeafImage.src = "images/leaf.png";

  //You Lose Message image
  loseImage = new Image();
  loseImage.onload = function () {
    loseReady = false;
  };
  loseImage.src = "images/dialoguebox.png";

  //Load sound effects
  scoreSound = new Audio("/soundEffects/score.mp3");
  loseSound = new Audio("/soundEffects/lose.mp3");
  loseLife = new Audio("/soundEffects/loselife.mp3");
}

/** 
 * Keyboard Listeners
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

//Display "You Lose Image"
function deadDisplay() {
  loseReady = true;
  heroReady = false;
  isabelleReady = false;
  tomReady = false;
  heroY = -100;
  loseSound.play();
  isPlaying = false;
  return;
}

let update = function () {

  //Check if Player hit Tom or Isabelle. If they do, player instantly loses.
  if (
    heroX >= tomX - 60
    && heroX <= (tomX + 60)
    && heroY >= tomY - 10
  ) {
    deadDisplay();
    isPlaying = false;
  }

  if (
    heroX >= isabelleX - 30
    && heroX <= (isabelleX + 120)
    && heroY >= isabelleY - 30
  ) {
    deadDisplay();
    isPlaying = false;
  }


  //Checks if player runs out of lives -> player loses
  if (isPlaying === true && life === 0) {
    deadDisplay();
    life = 1;
    isPlaying = false;
  }


  if (isPlaying = true) {
    //Jumping functions
    function jumpForward() {
      heroX += 5;
      heroY += 10;
    }

    function jumpBackward() {
      heroX -= 10;
      heroY += 10;
    }

    function jumpUp() {
      heroY += 10;
    }

    if (38 in keysDown) { // Jump straight up
      heroY -= 10;
      setTimeout(jumpUp, 150);
    }

    if (38 in keysDown && 39 in keysDown) { // Forward Jump 38:up 39:right
      heroX += 5;
      heroY -= 10;
      setTimeout(jumpForward, 150); // 150 m/s until jump down function is triggered
    }

    if (38 in keysDown && 37 in keysDown) { // Backward Jump 37:left
      heroX += 5;
      heroY -= 10;
      setTimeout(jumpBackward, 150); // 150 m/s until jump down function is triggered
    }

    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
    }

    //Speed of images

    isabelleX -= 3;
    tomX -= 3;


    //Bullet shooting
    function shoot() {
      bulletX = heroX + 60;
      bulletY = heroY + 20;
    }

    if (32 in keysDown) { // space button triggers bullet
      bulletReady = true;
      bulletFire = true;
      bulletX = heroX + 60;
      bulletY = heroY + 20;
      if (!bulletX) {
        setTimeout(shoot(), 150); // 150 m/s until bullet starts moving
        startgame.blur()
      }
    }
    if (bulletFire) {
      bulletX += 5;
      bulletY = bulletY;
    }

    //Characters keep wrapping in x-direction
    if (tomX < -60) {
      tomX = canvas.width - 60
    }
    if (isabelleX < -150) {
      isabelleX = canvas.width - 60
    }

    if (heroX < 0) { //wrap hero in x-direction
      heroX = canvas.width - 60;
    }

    if (heroX > canvas.width - 60) { //wrap hero in x-direction
      heroX = 0;
    }


    //Check if bullet and objects collided. If bullet hits tom +1 point. If bullet hits Isabelle -1 life.
    if (
      bulletX >= tomX //bullet x tom
      && bulletX <= tomX + 80
      && bulletY > tomY
      && bulletY < tomY + 80
    ) {
      bulletReady = false;
      bulletFire = false;
      tomX = Math.random() * 100 + canvas.width + 350;
      bulletX = 200;
      bulletY = 200;
      scoreSound.play();
      ++score;
    }

    if (
      bulletX >= isabelleX // bullet x isabelle
      && bulletX <= isabelleX + 80
      && bulletY > isabelleY
      && bulletY < isabelleY + 80
    ) {
      loseLife.play();
      bulletReady = false;
      bulletFire = false;
      isabelleX = Math.random() * canvas.width - 150
      bulletX = 200;
      bulletY = 200;
      --life;
      if (life === 2) {
        thirdLeafReady = false;
      } else if (life === 1) {
        thirdLeafReady = false;
        secondLeafReady = false;
      } else if (life === 0) {
        thirdLeafReady = false;
        secondLeafReady = false;
        firstLeafReady = false;
      }

      isabelleX = Math.random() * 100 + canvas.width + 350;
    }
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (bulletReady) {
    ctx.drawImage(bulletImage, bulletX, bulletY);
  }
  if (tomReady) { //tomNook Ready?
    ctx.drawImage(tomImage, tomX, tomY);
  }
  if (isabelleReady) { //isabelle Ready?
    ctx.drawImage(isabelleImage, isabelleX, isabelleY);
  }
  if (decorReady) {
    ctx.drawImage(decorImage, decorX, decorY);
  }
  if (firstLeafReady) {
    ctx.drawImage(firstLeafImage, firstLeafX, firstLeafY);
  }
  if (secondLeafReady) {
    ctx.drawImage(secondLeafImage, secondLeafX, secondLeafY);
  }
  if (thirdLeafReady) {
    ctx.drawImage(thirdLeafImage, thirdLeafX, thirdLeafY);
  }
  if (loseReady) {
    ctx.drawImage(loseImage, loseX, loseY);
  }
  ctx.fillText(`Score: ${score}`, 20, 50);
  scoreDisplay.innerHTML = `Score: ${score}`;
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main); //means call main again like main(), does it like 60x a second
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages(); //get pics rdy //1 process input
setupKeyboardListeners(); //1. process input
//main();

//The actual main game loop
function game() {
  if (isPlaying) {
    myAudio.play();
    return
  }
  loadImages();
  main();
}

//Background Music
var myAudio = document.getElementById("bgMusic");
myAudio.autoplay = true;

function pauseMusic() {
  myAudio.pause();
}


//Score History
let scores = [];

//Displays the user's highest score
function highestScore() {
  if (score > highScore) {
    highScore = score;
    yourGameHistory.innerHTML = `High Score:  ${highScore}`;
  }
}

//When you click the submit score button, it updates the user's highest score and the leaderboard
function scoreSubmit() {
  let match = {
    Name: playerName.value,
    Score: score
  }

  //scores['Name'] = playerName.value;
  //scores['Score'] = score;
  scores.push(match);

  newscores = JSON.stringify(scores);
  updateLeaderboardView();
  saveScores();
}

//Updating the Leaderboard, sorts by score
function updateLeaderboardView() {
  
  let leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  scores.sort(function (a, b) {
    return b.Score - a.Score
  });

  let elements = []; // we'll need created elements to update colors later on
  // create elements for each player
  for (let i = 0; i < scores.length; i++) {
    let Name = document.createElement("div");
    let Score = document.createElement("div");
    Name.classList.add("Name");
    Score.classList.add("Score");
    Name.innerText = scores[i].Name + ` `;
    Score.innerText = scores[i].Score;

    let scoreRow = document.createElement("div");
    scoreRow.classList.add("row");
    scoreRow.appendChild(Name);
    scoreRow.appendChild(Score);
    leaderboard.appendChild(scoreRow);
    elements.push(scoreRow);
  }
  let colors = ["gold", "silver", "#cd7f32"]; //first place displayed in gold, second place displayed in silver, etc.
  for (let i = 0; i < 3; i++) {
    elements[i].style.color = colors[i];
  }
}

//Reset the game
function playAgain() {
  b;
  isPlaying = false;
  resetBtn.blur();
  bulletFire = false;
  life = 3;
  score = 0;
  highScore = 0;
  console.log("hi");
  keysDown = {};

  //Initial positions
  heroX = 60;
  heroY = 340;

  firstLeafX = 500;
  firstLeafY = 20;

  secondLeafX = 560;
  secondLeafY = 20;

  thirdLeafX = 620;
  thirdLeafY = 20;

  bulletX;
  bulletY;

  tomX = 400;
  tomY = 340;

  isabelleX = 590;
  isabelleY = 290;

  decorX = 200;
  decorY = 50;

  loseX = -30;
  loseY = -100;

  //images ready
  render();
  loadImages();
}

function saveScores(){
  let str = JSON.stringify(scores);
  localStorage.setItem("scores",str);
}

//get data from storage
function getScores(){
  let str = localStorage.getItem("scores")
  scores = JSON.parse(str);
  if (!scores){
      scores = [];
  }
}

getScores()