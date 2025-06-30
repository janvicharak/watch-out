// script.js

/*const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-game");
const rollBtn = document.getElementById("roll-dice");
const endTurnBtn = document.getElementById("end-turn");
const skipTurnBtn = document.getElementById("skip-turn");
const playerCountSelect = document.getElementById("player-count");
const player1Info = document.getElementById("player1-info");
const player2Info = document.getElementById("player2-info");
const logContainer = document.getElementById("log-container");
const toggleLogBtn = document.getElementById("toggle-log");
const turnInfo = document.getElementById("turn-info");
const rolledInfo = document.getElementById("rolled-info");
const hoverMessage = document.getElementById("hover-message");
const gameOverScreen = document.getElementById("game-over");
const winnerMessage = document.getElementById("winner-message");
const restartBtn = document.getElementById("restart-game");
const dice = document.getElementById("dice");


let players = [];
let positions = [];
let scores = [];
let currentPlayerIndex = 0;
let gameActive = false;
let currentRollCount = 0;
let isComputerTurn = false;

// Event Listeners
startBtn.addEventListener("click", startGame);
rollBtn.addEventListener("click", rollDice);
endTurnBtn.addEventListener("click", endTurn);
skipTurnBtn.addEventListener("click", skipTurn);
toggleLogBtn.addEventListener("click", toggleLog);
restartBtn.addEventListener("click", restartGame);

function toggleLog() {
  logContainer.style.display = logContainer.style.display === "block" ? "none" : "block";
}

function restartGame() {
  location.reload();
}

function startGame() {
  const playerCount = parseInt(playerCountSelect.value);
  players = playerCount === 1 ? ["🔵", "🤖"] : ["🔵", "🔴"];
  positions = [0, 0];
  scores = [0, 0];
  currentPlayerIndex = 0;
  gameActive = true;
  currentRollCount = 0;
  gameOverScreen.style.display = "none";

  createBoard();
  renderPlayers();
  log("Game started!");
  startTurn();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement("div");
    cell.className = "tile";
    if (i >= 6 && i <= 8) cell.classList.add("flag");
    if (i === 9) cell.classList.add("cliff");
    cell.innerText = i;
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

function renderPlayers() {
  document.querySelectorAll(".token").forEach(e => e.remove());
  players.forEach((p, i) => {
    const pos = positions[i];
    if (pos >= 1 && pos <= 9) {
      const cell = document.querySelector(`.tile:nth-child(${pos})`);
      const token = document.createElement("div");
      token.className = "token";
      if (p === "🤖") token.classList.add("bot");
      token.innerText = p === "🤖" ? "" : p;
      cell.appendChild(token);
    }
  });

  player1Info.innerHTML = `<strong>Player 1 (${players[0]}):</strong><br>Position: ${positions[0]}<br>Score: ${scores[0]}`;
  player2Info.innerHTML = `<strong>Player 2 (${players[1]}):</strong><br>Position: ${positions[1]}<br>Score: ${scores[1]}`;
}

function startTurn() {
  if (!gameActive) return;

  currentRollCount = 0;
  endTurnBtn.disabled = true;

  const player = players[currentPlayerIndex];
  turnInfo.textContent = `Player ${currentPlayerIndex + 1}'s turn (${player})`;
  rolledInfo.textContent = "🎲 Roll to start!";
  log(`Player ${currentPlayerIndex + 1}'s turn.`);

  isComputerTurn = player === "🤖";
  if (isComputerTurn) {
    rollBtn.disabled = true;
    skipTurnBtn.disabled = true;
    setTimeout(() => computerPlay(), 1000);
  } else {
    rollBtn.disabled = false;
    skipTurnBtn.disabled = false;
  }
}

function rollDice() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  currentRollCount++;
  showDiceRoll(roll);
}

/*function showDiceRoll(rollValue) {
  dice.classList.add("rolling");
  
  rollBtn.disabled = true;
  endTurnBtn.disabled = true;
  skipTurnBtn.disabled = true;
  
  setTimeout(() => {
    dice.classList.remove("rolling");
    dice.className = "dice";
    dice.classList.add(`dice-${rollValue}`);
    
    continueAfterRoll(rollValue);
  }, 1000);
}
function showDiceRoll(rollValue) {
  // Clear all dice faces
  document.querySelectorAll('.dice-face').forEach(face => {
    face.classList.remove('active');
  });

  // Activate the correct face
  const face = document.getElementById(`face-${rollValue}`);
  if (face) face.classList.add('active');

  // Continue game logic
  rollBtn.disabled = true;
  endTurnBtn.disabled = true;
  skipTurnBtn.disabled = true;

  setTimeout(() => {
    continueAfterRoll(rollValue);
  }, 1000);
}

function continueAfterRoll(roll) {
  rolledInfo.textContent = isComputerTurn ? `🤖 Rolled: ${roll}` : `🎲 Rolled: ${roll}`;
  showHoverMessage(`${isComputerTurn ? '🤖' : '🎲'} Rolled a ${roll}`);
  log(`${isComputerTurn ? '🤖' : 'Player'} rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`${isComputerTurn ? '🤖' : 'Player'} fell off! -1 point.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '💥'} Fell off! -1`);
    
    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  // Award points only when landing exactly on these steps
  if (newPos === 6 || newPos === 7 || newPos === 8) {
    scores[currentPlayerIndex] += 1;
    log(`${isComputerTurn ? '🤖' : 'Player'} landed on step ${newPos}! +1 point.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '🏁'} Landed on ${newPos}! +1`);
  } 
  else if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    log(`${isComputerTurn ? '🤖' : 'Player'} reached cliff edge! +3 points.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '🌟'} Cliff edge! +3`);
  }

  renderPlayers();

  // Enable end turn button after roll
  endTurnBtn.disabled = false;
  
  // Auto-end turn if reached cliff (step 9)
  if (newPos === 9) {
    rollBtn.disabled = true;
    if (!isComputerTurn) {
      setTimeout(() => {
        showHoverMessage("Reached cliff! Turn ends");
        endTurn();
      }, 1500);
    } else {
      setTimeout(() => {
        log("🤖 Reached cliff! Turn ends.");
        endTurn();
      }, 1000);
    }
  } else {
    // Enable roll button for human players
    if (!isComputerTurn) {
      rollBtn.disabled = false;
    }
  }
}

function endTurn() {
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    calculateRound();
    positions = [0, 0];
    currentPlayerIndex = 0;
  }

  if (Math.max(...scores) >= 12) {
    const winnerIndex = scores.indexOf(Math.max(...scores));
    winnerMessage.textContent = `Player ${winnerIndex + 1} (${players[winnerIndex]}) wins! 🎉`;
    gameOverScreen.style.display = "flex";
    gameActive = false;
    return;
  }
  startTurn();
}

function skipTurn() {
  log(`⏩ Player ${currentPlayerIndex + 1} skipped turn.`);
  endTurn();
}

function computerPlay() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  currentRollCount++;
  showDiceRoll(roll);
  
  setTimeout(() => {
    const newPos = positions[currentPlayerIndex] + roll;
    
    // Computer decision logic
    const shouldContinue = 
      newPos < 9 && // Never continue after reaching cliff
      (currentRollCount < 2 || // Always roll at least twice
       (newPos < 7 && Math.random() < 0.7) || // 70% chance to continue if behind
       (Math.random() < 0.3)); // 30% chance to continue otherwise
    
    if (shouldContinue) {
      setTimeout(computerPlay, 1500);
    } else {
      setTimeout(() => {
        if (Math.max(...scores) >= 12) {
          const winnerIndex = scores.indexOf(Math.max(...scores));
          winnerMessage.textContent = `Player ${winnerIndex + 1} (${players[winnerIndex]}) wins! 🎉`;
          gameOverScreen.style.display = "flex";
          gameActive = false;
          return;
        }
        log("🤖 Ends turn.");
        endTurn();
      }, 1000);
    }
  }, 1000);
}

function calculateRound() {
  const maxStep = Math.max(...positions);
  if (maxStep >= 6) {
    positions.forEach((pos, i) => {
      if (pos === maxStep) {
        scores[i] += 2;
        log(`⭐ Player ${i + 1} was furthest at step ${pos}! +2 bonus.`);
        showHoverMessage(`⭐ Player ${i + 1} furthest! +2`);
      }
    });
  }
  renderPlayers();
  log(`📊 Scores: P1: ${scores[0]}, P2: ${scores[1]}`);
}

function log(msg) {
  const entry = document.createElement("div");
  entry.textContent = msg;
  logContainer.prepend(entry);
}

function showHoverMessage(text) {
  hoverMessage.textContent = text;
  hoverMessage.classList.add("show");
  setTimeout(() => {
    hoverMessage.classList.remove("show");
  }, 2500);
}*/
/*const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-game");
const rollBtn = document.getElementById("roll-dice");
const endTurnBtn = document.getElementById("end-turn");
const skipTurnBtn = document.getElementById("skip-turn");
const playerCountSelect = document.getElementById("player-count");
const player1Info = document.getElementById("player1-info");
const player2Info = document.getElementById("player2-info");
const logContainer = document.getElementById("log-container");
const toggleLogBtn = document.getElementById("toggle-log");
const turnInfo = document.getElementById("turn-info");
const rolledInfo = document.getElementById("rolled-info");
const winnerMessage = document.getElementById("winner-message");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-game");
const dice = document.getElementById("dice");

let players = [], scores = [], positions = [], currentPlayerIndex = 0;
let gameActive = false, isComputerTurn = false;

startBtn.onclick = startGame;
rollBtn.onclick = rollDice;
endTurnBtn.onclick = endTurn;
skipTurnBtn.onclick = () => endTurn();
toggleLogBtn.onclick = () => {
  logContainer.style.display = logContainer.style.display === "block" ? "none" : "block";
};
restartBtn.onclick = () => location.reload();

function startGame() {
  const count = parseInt(playerCountSelect.value);
  players = count === 1 ? ["🔵", "🤖"] : ["🔵", "🔴"];
  scores = [0, 0];
  positions = [0, 0];
  currentPlayerIndex = 0;
  gameActive = true;
  gameOverScreen.style.display = "none";

  buildBoard();
  updateBoard();
  log("Game started!");
  takeTurn();
}

function buildBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement("div");
    cell.className = "tile";
    if (i >= 6 && i <= 8) cell.classList.add("flag");
    if (i === 9) cell.classList.add("cliff");
    cell.innerText = i;
    board.appendChild(cell);
  }
}

function updateBoard() {
  document.querySelectorAll(".token").forEach(e => e.remove());
  players.forEach((player, idx) => {
    const pos = positions[idx];
    if (pos > 0 && pos <= 9) {
      const cell = board.children[pos - 1];
      const token = document.createElement("div");
      token.className = "token";
      if (player === "🤖") token.classList.add("bot");
      token.textContent = player === "🤖" ? "" : player;
      cell.appendChild(token);
    }
  });
  player1Info.innerHTML = `<strong>Player 1 (${players[0]}):</strong><br>Position: ${positions[0]}<br>Score: ${scores[0]}`;
  player2Info.innerHTML = `<strong>Player 2 (${players[1]}):</strong><br>Position: ${positions[1]}<br>Score: ${scores[1]}`;
}

function takeTurn() {
  const player = players[currentPlayerIndex];
  turnInfo.textContent = `Player ${currentPlayerIndex + 1}'s turn (${player})`;
  rolledInfo.textContent = `🎲 Roll to begin`;
  rollBtn.disabled = false;
  endTurnBtn.disabled = true;
  isComputerTurn = player === "🤖";

  if (isComputerTurn) {
    rollBtn.disabled = true;
    setTimeout(() => {
      const roll = rollDice();
      continueAfterRoll(roll);
    }, 1000);
  }
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  rolledInfo.textContent = `${players[currentPlayerIndex]} rolled a ${roll}`;
  log(`${players[currentPlayerIndex]} rolled ${roll}`);
  animateDice(roll);
  return roll;
}

function animateDice(value) {
  const rotations = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(180deg) rotateY(0deg)",
    3: "rotateY(-90deg)",
    4: "rotateY(90deg)",
    5: "rotateX(-90deg)",
    6: "rotateX(90deg)"
  };
  dice.style.transform = rotations[value];
  setTimeout(() => continueAfterRoll(value), 1000);
}

function continueAfterRoll(roll) {
  positions[currentPlayerIndex] += roll;
  if (positions[currentPlayerIndex] > 9) {
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    positions[currentPlayerIndex] = 0;
    log("❌ Fell off! -1 point");
  } else if ([6, 7, 8].includes(positions[currentPlayerIndex])) {
    scores[currentPlayerIndex] += 1;
    log("🏁 +1 point");
  } else if (positions[currentPlayerIndex] === 9) {
    scores[currentPlayerIndex] += 3;
    log("🌟 +3 points at cliff!");
  }

  updateBoard();
  endTurnBtn.disabled = false;
  rollBtn.disabled = true;
}

function endTurn() {
  if (scores[currentPlayerIndex] >= 12) {
    winnerMessage.textContent = `${players[currentPlayerIndex]} wins the game! 🎉`;
    gameOverScreen.style.display = "flex";
    gameActive = false;
    return;
  }
  currentPlayerIndex = (currentPlayerIndex + 1) % 2;
  takeTurn();
}

function log(message) {
  const entry = document.createElement("div");
  entry.textContent = message;
  logContainer.prepend(entry);
}*/
const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-game");
const rollBtn = document.getElementById("roll-dice");
const endTurnBtn = document.getElementById("end-turn");
const skipTurnBtn = document.getElementById("skip-turn");
const playerCountSelect = document.getElementById("player-count");
const player1Info = document.getElementById("player1-info");
const player2Info = document.getElementById("player2-info");
const logContainer = document.getElementById("log-container");
const toggleLogBtn = document.getElementById("toggle-log");
const turnInfo = document.getElementById("turn-info");
const rolledInfo = document.getElementById("rolled-info");
const hoverMessage = document.getElementById("hover-message");
const gameOverScreen = document.getElementById("game-over");
const winnerMessage = document.getElementById("winner-message");
const restartBtn = document.getElementById("restart-game");
const dice = document.getElementById("dice");

let players = [];
let positions = [];
let scores = [];
let currentPlayerIndex = 0;
let gameActive = false;
let currentRollCount = 0;
let isComputerTurn = false;

// Event Listeners
startBtn.addEventListener("click", startGame);
rollBtn.addEventListener("click", rollDice);
endTurnBtn.addEventListener("click", endTurn);
skipTurnBtn.addEventListener("click", skipTurn);
toggleLogBtn.addEventListener("click", toggleLog);
restartBtn.addEventListener("click", restartGame);

function toggleLog() {
  logContainer.style.display = logContainer.style.display === "block" ? "none" : "block";
}

function restartGame() {
  location.reload();
}

function startGame() {
  const playerCount = parseInt(playerCountSelect.value);
  players = playerCount === 1 ? ["🔵", "🤖"] : ["🔵", "🔴"];
  positions = [0, 0];
  scores = [0, 0];
  currentPlayerIndex = 0;
  gameActive = true;
  currentRollCount = 0;
  gameOverScreen.style.display = "none";

  createBoard();
  renderPlayers();
  log("Game started!");
  startTurn();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement("div");
    cell.className = "tile";
    if (i >= 6 && i <= 8) cell.classList.add("flag");
    if (i === 9) cell.classList.add("cliff");
    cell.innerText = i;
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

function renderPlayers() {
  document.querySelectorAll(".token").forEach(e => e.remove());
  players.forEach((p, i) => {
    const pos = positions[i];
    if (pos >= 1 && pos <= 9) {
      const cell = document.querySelector(`.tile:nth-child(${pos})`);
      const token = document.createElement("div");
      token.className = "token";
      if (p === "🤖") token.classList.add("bot");
      token.innerText = p === "🤖" ? "" : p;
      cell.appendChild(token);
    }
  });

  player1Info.innerHTML = `<strong>Player 1 (${players[0]}):</strong><br>Position: ${positions[0]}<br>Score: ${scores[0]}`;
  player2Info.innerHTML = `<strong>Player 2 (${players[1]}):</strong><br>Position: ${positions[1]}<br>Score: ${scores[1]}`;
}

function startTurn() {
  if (!gameActive) return;

  currentRollCount = 0;
  endTurnBtn.disabled = true;

  const player = players[currentPlayerIndex];
  turnInfo.textContent = `Player ${currentPlayerIndex + 1}'s turn (${player})`;
  rolledInfo.textContent = "🎲 Roll to start!";
  log(`Player ${currentPlayerIndex + 1}'s turn.`);

  isComputerTurn = player === "🤖";
  if (isComputerTurn) {
    rollBtn.disabled = true;
    skipTurnBtn.disabled = true;
    setTimeout(() => computerPlay(), 1000);
  } else {
    rollBtn.disabled = false;
    skipTurnBtn.disabled = false;
  }
}

function rollDice() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  currentRollCount++;
  showDiceRoll(roll);
}

function showDiceRoll(rollValue) {
  dice.classList.add("rolling");
  
  rollBtn.disabled = true;
  endTurnBtn.disabled = true;
  skipTurnBtn.disabled = true;
  
  setTimeout(() => {
    dice.classList.remove("rolling");
    dice.className = "dice";
    dice.classList.add(`dice-${rollValue}`);
    
    continueAfterRoll(rollValue);
  }, 1000);
}

function continueAfterRoll(roll) {
  rolledInfo.textContent = isComputerTurn ? `🤖 Rolled: ${roll}` : `🎲 Rolled: ${roll}`;
  showHoverMessage(`${isComputerTurn ? '🤖' : '🎲'} Rolled a ${roll}`);
  log(`${isComputerTurn ? '🤖' : 'Player'} rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`${isComputerTurn ? '🤖' : 'Player'} fell off! -1 point.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '💥'} Fell off! -1`);
    
    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  // Award points only when landing exactly on these steps
  if (newPos === 6 || newPos === 7 || newPos === 8) {
    scores[currentPlayerIndex] += 1;
    log(`${isComputerTurn ? '🤖' : 'Player'} landed on step ${newPos}! +1 point.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '🏁'} Landed on ${newPos}! +1`);
  } 
  else if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    log(`${isComputerTurn ? '🤖' : 'Player'} reached cliff edge! +3 points.`);
    showHoverMessage(`${isComputerTurn ? '🤖' : '🌟'} Cliff edge! +3`);
  }

  renderPlayers();

  // Enable end turn button after roll
  endTurnBtn.disabled = false;
  
  // Auto-end turn if reached cliff (step 9)
  if (newPos === 9) {
    rollBtn.disabled = true;
    if (!isComputerTurn) {
      setTimeout(() => {
        showHoverMessage("Reached cliff! Turn ends");
        endTurn();
      }, 1500);
    } else {
      setTimeout(() => {
        log("🤖 Reached cliff! Turn ends.");
        endTurn();
      }, 1000);
    }
  } else {
    // Enable roll button for human players
    if (!isComputerTurn) {
      rollBtn.disabled = false;
    }
  }
}

function endTurn() {
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    calculateRound();
    positions = [0, 0];
    currentPlayerIndex = 0;
  }

  if (Math.max(...scores) >= 12) {
    const winnerIndex = scores.indexOf(Math.max(...scores));
    winnerMessage.textContent = `Player ${winnerIndex + 1} (${players[winnerIndex]}) wins! 🎉`;
    gameOverScreen.style.display = "flex";
    gameActive = false;
    return;
  }
  startTurn();
}

function skipTurn() {
  log(`⏩ Player ${currentPlayerIndex + 1} skipped turn.`);
  endTurn();
}

function computerPlay() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  currentRollCount++;
  showDiceRoll(roll);
  
  setTimeout(() => {
    const newPos = positions[currentPlayerIndex] + roll;
    
    // Computer decision logic
    const shouldContinue = 
      newPos < 9 && // Never continue after reaching cliff
      (currentRollCount < 2 || // Always roll at least twice
       (newPos < 7 && Math.random() < 0.7) || // 70% chance to continue if behind
       (Math.random() < 0.3)); // 30% chance to continue otherwise
    
    if (shouldContinue) {
      setTimeout(computerPlay, 1500);
    } else {
      setTimeout(() => {
        if (Math.max(...scores) >= 12) {
          const winnerIndex = scores.indexOf(Math.max(...scores));
          winnerMessage.textContent = `Player ${winnerIndex + 1} (${players[winnerIndex]}) wins! 🎉`;
          gameOverScreen.style.display = "flex";
          gameActive = false;
          return;
        }
        log("🤖 Ends turn.");
        endTurn();
      }, 1000);
    }
  }, 1000);
}

function calculateRound() {
  const maxStep = Math.max(...positions);
  if (maxStep >= 6) {
    positions.forEach((pos, i) => {
      if (pos === maxStep) {
        scores[i] += 2;
        log(`⭐ Player ${i + 1} was furthest at step ${pos}! +2 bonus.`);
        showHoverMessage(`⭐ Player ${i + 1} furthest! +2`);
      }
    });
  }
  renderPlayers();
  log(`📊 Scores: P1: ${scores[0]}, P2: ${scores[1]}`);
}

function log(msg) {
  const entry = document.createElement("div");
  entry.textContent = msg;
  logContainer.prepend(entry);
}

function showHoverMessage(text) {
  hoverMessage.textContent = text;
  hoverMessage.classList.add("show");
  setTimeout(() => {
    hoverMessage.classList.remove("show");
  }, 2500);
}