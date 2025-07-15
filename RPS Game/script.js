const choices = ['rock', 'paper', 'scissor'];
let userChoice = null;
let userScore = 0;
let computerScore = 0;

const rockEl = document.getElementById('rock');
const paperEl = document.getElementById('paper');
const scissorEl = document.getElementById('scissors');
const resultEl = document.getElementById('result');
const userScoreEl = document.getElementById('userScore');
const compScoreEl = document.getElementById('computerScore');
const finalMessageEl = document.getElementById('finalMessage');

function selectChoice(choice) {
  userChoice = choice;
  rockEl.classList.remove('selected');
  paperEl.classList.remove('selected');
  scissorEl.classList.remove('selected');

  if (choice === 'rock') rockEl.classList.add('selected');
  if (choice === 'paper') paperEl.classList.add('selected');
  if (choice === 'scissor') scissorEl.classList.add('selected');
}

rockEl.addEventListener('click', () => selectChoice('rock'));
paperEl.addEventListener('click', () => selectChoice('paper'));
scissorEl.addEventListener('click', () => selectChoice('scissor'));

document.getElementById('playButton').addEventListener('click', playGame);
document.getElementById('resetButton').addEventListener('click', resetGame);

function playGame() {
  if (!userChoice) {
    resultEl.innerText = '❗ Please select an option to play!';
    return;
  }

  if (userScore >= 10 || computerScore >= 10) {
    resultEl.innerText = '🎯 Game Over! Click "Reset" to play again.';
    return;
  }

  const computerIndex = Math.floor(Math.random() * choices.length);
  const computerChoice = choices[computerIndex];

  let message = '';

  if (userChoice === computerChoice) {
    message = `🤝 It's a tie! You both chose ${capitalize(computerChoice)}.`;
  } else if (
    (userChoice === 'rock' && computerChoice === 'scissor') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissor' && computerChoice === 'paper')
  ) {
    userScore++;
    message = `🎉 You win! You chose ${capitalize(userChoice)} and computer chose ${capitalize(computerChoice)}.`;
  } else {
    computerScore++;
    message = `💥 You lose! You chose ${capitalize(userChoice)} and computer chose ${capitalize(computerChoice)}.`;
  }

  userScoreEl.innerText = userScore;
  compScoreEl.innerText = computerScore;
  resultEl.innerText = message;

  if (userScore === 10) {
    finalMessageEl.innerText = '🏆 Congratulations! You are the final winner!';
  } else if (computerScore === 10) {
    finalMessageEl.innerText = '💻 Computer wins the game! Try again!';
  }
}

function resetGame() {
  userScore = 0;
  computerScore = 0;
  userScoreEl.innerText = 0;
  compScoreEl.innerText = 0;
  resultEl.innerText = 'Make your move to start!';
  finalMessageEl.innerText = '';
  userChoice = null;
  rockEl.classList.remove('selected');
  paperEl.classList.remove('selected');
  scissorEl.classList.remove('selected');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
