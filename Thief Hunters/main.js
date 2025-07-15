const buildings = document.querySelectorAll(".game-area img");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time-left");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timeLeft = 30;
let currentThiefIndex = -1;
let gameInterval;
let timerInterval;

function resetBuildings() {
  for (let i = 0; i < buildings.length; i++) {
    buildings[i].src = "b1.png";
  }
}

function placeThief() {
  resetBuildings();
  currentThiefIndex = Math.floor(Math.random() * buildings.length);
  buildings[currentThiefIndex].src = "thief.png";
}

for (let i = 0; i < buildings.length; i++) {
  buildings[i].addEventListener("click", function () {
    if (i === currentThiefIndex) {
      score++;
      scoreDisplay.textContent = score;
      buildings[i].src = "b1.png";
      currentThiefIndex = -1;
    }
  });
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = true;

  placeThief();
  gameInterval = setInterval(placeThief, 1000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      resetBuildings();
      alert("Time's up! Your final score is: " + score);
      startBtn.disabled = false;
    }
  }, 1000);
}

startBtn.addEventListener("click", startGame);
