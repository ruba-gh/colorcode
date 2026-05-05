const colors = [
  "#e63946",
  "#f77f00",
  "#fcbf49",
  "#2a9d8f",
  "#457b9d",
  "#6a4c93",
  "#ffafcc",
  "#8ac926",
  "#ffffff"
];

const maxTries = 6;
const codeLength = 4;

let secretCode = [];
let currentGuess = [];
let attempts = 0;
let gameOver = false;

const board = document.getElementById("board");
const guessSlots = document.getElementById("guessSlots");
const colorPalette = document.getElementById("colorPalette");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

function startGame() {
  secretCode = Array.from(
    { length: codeLength },
    () => colors[Math.floor(Math.random() * colors.length)]
  );

  currentGuess = [];
  attempts = 0;
  gameOver = false;
  message.textContent = "";

  createBoard();
  createGuessSlots();
  createPalette();

  console.log("Secret code:", secretCode);
}

function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < maxTries; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < codeLength; j++) {
      const cube = document.createElement("div");
      cube.classList.add("cube");
      row.appendChild(cube);
    }

    const feedback = document.createElement("div");
    feedback.classList.add("feedback");
    feedback.textContent = "Waiting...";
    row.appendChild(feedback);

    board.appendChild(row);
  }
}

function createGuessSlots() {
  guessSlots.innerHTML = "";

  for (let i = 0; i < codeLength; i++) {
    const slot = document.createElement("div");
    slot.classList.add("guess-slot");

    slot.addEventListener("click", () => {
      currentGuess.splice(i, 1);
      updateGuessSlots();
    });

    guessSlots.appendChild(slot);
  }
}

function createPalette() {
  colorPalette.innerHTML = "";

  colors.forEach(color => {
    const colorBtn = document.createElement("button");
    colorBtn.classList.add("color-option");
    colorBtn.style.backgroundColor = color;

    if (color === "#ffffff") {
      colorBtn.style.borderColor = "#999";
    }

    colorBtn.addEventListener("click", () => {
      if (currentGuess.length < codeLength && !gameOver) {
        currentGuess.push(color);
        updateGuessSlots();
      }
    });

    colorPalette.appendChild(colorBtn);
  });
}

function updateGuessSlots() {
  const slots = document.querySelectorAll(".guess-slot");

  slots.forEach((slot, index) => {
    slot.style.backgroundColor = currentGuess[index] || "transparent";
  });
}

function checkGuess() {
  let correctSpot = 0;
  let wrongSpot = 0;

  const secretUsed = Array(codeLength).fill(false);
  const guessUsed = Array(codeLength).fill(false);

  for (let i = 0; i < codeLength; i++) {
    if (currentGuess[i] === secretCode[i]) {
      correctSpot++;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  for (let i = 0; i < codeLength; i++) {
    if (guessUsed[i]) continue;

    for (let j = 0; j < codeLength; j++) {
      if (!secretUsed[j] && currentGuess[i] === secretCode[j]) {
        wrongSpot++;
        secretUsed[j] = true;
        break;
      }
    }
  }

  return { correctSpot, wrongSpot };
}

submitBtn.addEventListener("click", () => {
  if (gameOver) return;

  if (currentGuess.length < codeLength) {
    message.textContent = "Choose 4 colors first.";
    return;
  }

  const row = board.children[attempts];
  const cubes = row.querySelectorAll(".cube");
  const feedback = row.querySelector(".feedback");

  currentGuess.forEach((color, index) => {
    cubes[index].style.backgroundColor = color;
  });

  const result = checkGuess();

  feedback.innerHTML = `
    ${result.correctSpot} color(s) in the correct spot<br>
    ${result.wrongSpot} color(s) correct but wrong spot
  `;

  if (result.correctSpot === codeLength) {
    message.textContent = "You won! Correct sequence.";
    gameOver = true;
    return;
  }

  attempts++;
  currentGuess = [];
  updateGuessSlots();

  if (attempts === maxTries) {
    message.textContent = "Game over! Try a new game.";
    gameOver = true;
  }
});

clearBtn.addEventListener("click", () => {
  currentGuess = [];
  updateGuessSlots();
  message.textContent = "";
});

resetBtn.addEventListener("click", startGame);

startGame();