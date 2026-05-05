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

const codeLength = 4;

let secretCode = [];
let currentGuess = [];
let gameOver = false;

const board = document.getElementById("board");
const guessSlots = document.getElementById("guessSlots");
const colorPalette = document.getElementById("colorPalette");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const quitBtn = document.getElementById("quitBtn");
const replayBtn = document.getElementById("replayBtn");
const message = document.getElementById("message");
const answerBox = document.getElementById("answerBox");
const answerColors = document.getElementById("answerColors");

function startGame() {
  secretCode = generateUniqueCode();
  currentGuess = [];
  gameOver = false;

  board.innerHTML = "";
  message.textContent = "";
  answerBox.classList.add("hidden");

  createGuessSlots();
  createPalette();

  console.log("Secret code:", secretCode);
}

function generateUniqueCode() {
  const shuffled = [...colors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, codeLength);
}

function createGuessSlots() {
  guessSlots.innerHTML = "";

  for (let i = 0; i < codeLength; i++) {
    const slot = document.createElement("div");
    slot.classList.add("guess-slot");

    slot.addEventListener("click", () => {
      if (gameOver) return;
      currentGuess.splice(i, 1);
      updateGuessSlots();
    });

    guessSlots.appendChild(slot);
  }

  updateGuessSlots();
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
      if (gameOver) return;

      if (currentGuess.length < codeLength) {
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
        guessUsed[i] = true;
        break;
      }
    }
  }

  return { correctSpot, wrongSpot };
}

function addGuessToBoard(result) {
  const row = document.createElement("div");
  row.classList.add("row");

  currentGuess.forEach(color => {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.style.backgroundColor = color;
    row.appendChild(cube);
  });

  const feedback = document.createElement("div");
  feedback.classList.add("feedback");
  feedback.innerHTML = `
    ${result.correctSpot} color(s) in the correct spot<br>
    ${result.wrongSpot} color(s) correct but wrong spot
  `;

  row.appendChild(feedback);
  board.appendChild(row);
}

function showAnswer() {
  answerColors.innerHTML = "";

  secretCode.forEach(color => {
    const slot = document.createElement("div");
    slot.classList.add("guess-slot");
    slot.style.backgroundColor = color;
    answerColors.appendChild(slot);
  });

  answerBox.classList.remove("hidden");
}

submitBtn.addEventListener("click", () => {
  if (gameOver) return;

  if (currentGuess.length < codeLength) {
    message.textContent = "Choose 4 colors first.";
    return;
  }

  const result = checkGuess();
  addGuessToBoard(result);

  if (result.correctSpot === codeLength) {
    message.textContent = "You won! Correct sequence.";
    gameOver = true;
    showAnswer();
    return;
  }

  currentGuess = [];
  updateGuessSlots();
  message.textContent = "";
});

clearBtn.addEventListener("click", () => {
  if (gameOver) return;

  currentGuess = [];
  updateGuessSlots();
  message.textContent = "";
});

quitBtn.addEventListener("click", () => {
  gameOver = true;
  message.textContent = "You quit. Here is the answer.";
  showAnswer();
});

resetBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", startGame);

startGame();