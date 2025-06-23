// script.js
/*
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

const diceSound = document.getElementById("sound-dice");
const fallSound = document.getElementById("sound-fall");
const bonusSound = document.getElementById("sound-bonus");
const winSound = document.getElementById("sound-win");

let players = [];
let positions = [];
let scores = [];
let flagBonusAwarded = [];
let currentPlayerIndex = 0;
let gameActive = false;
let currentRollCount = 0;
let isComputerTurn = false;

startBtn.addEventListener("click", startGame);
rollBtn.addEventListener("click", rollDice);
endTurnBtn.addEventListener("click", endTurn);
skipTurnBtn.addEventListener("click", skipTurn);
toggleLogBtn.addEventListener("click", () => {
  logContainer.style.display = logContainer.style.display === "block" ? "none" : "block";
});

function startGame() {
  const playerCount = parseInt(playerCountSelect.value);
  players = playerCount === 1 ? ["🔵", "🤖"] : ["🔵", "🔴"];
  positions = [0, 0];
  scores = [0, 0];
  flagBonusAwarded = [false, false];
  currentPlayerIndex = 0;
  gameActive = true;
  currentRollCount = 0;

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
  flagBonusAwarded[currentPlayerIndex] = false;
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
  diceSound.play();
  currentRollCount++;
  rolledInfo.textContent = `🎲 Rolled: ${roll}`;
  showHoverMessage(`🎲 Rolled a ${roll}`);
  log(`Rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    fallSound.play();
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`💥 Fell off! -1 point.`);
    showHoverMessage(`💥 Fell off! -1`);

    if (!flagBonusAwarded[currentPlayerIndex] && prevPos < 8) {
      scores[currentPlayerIndex] += 1;
      bonusSound.play();
      log(`🏁 Passed flag before falling! +1 point.`);
      showHoverMessage(`🏁 Passed flag! +1`);
    }

    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  if (newPos >= 8 && !flagBonusAwarded[currentPlayerIndex]) {
    scores[currentPlayerIndex] += 1;
    bonusSound.play();
    flagBonusAwarded[currentPlayerIndex] = true;
    log(`🏁 Reached flag! +1 point.`);
    showHoverMessage(`🏁 Flag! +1`);
  }

  if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    bonusSound.play();
    log(`🌟 Reached cliff edge! +3 points.`);
    showHoverMessage(`🌟 Cliff edge! +3`);
  }

  renderPlayers();

  if (currentRollCount >= 1) endTurnBtn.disabled = false;
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
    winSound.play();
    log(`🎉 Player ${winnerIndex + 1} (${players[winnerIndex]}) wins!`);
    showHoverMessage(`🎉 Player ${winnerIndex + 1} wins!`);
    gameActive = false;
    setTimeout(() => {
      if (confirm("Game over! Restart?")) location.reload();
    }, 1500);
    return;
  }
  startTurn();
}

function skipTurn() {
  log(`⏩ Player ${currentPlayerIndex + 1} skipped turn.`);
  endTurn();
}

function calculateRound() {
  const maxStep = Math.max(...positions);
  positions.forEach((pos, i) => {
    if (pos === maxStep && pos >= 6) {
      scores[i] += 2;
      log(`⭐ Player ${i + 1} was furthest! +2 bonus.`);
      showHoverMessage(`⭐ Player ${i + 1} furthest! +2`);
    }
  });
  renderPlayers();
  log(`📊 Scores: P1: ${scores[0]}, P2: ${scores[1]}`);
}

function computerPlay() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  diceSound.play();
  currentRollCount++;
  rolledInfo.textContent = `🤖 Rolled: ${roll}`;
  log(`🤖 Rolled: ${roll}`);
  showHoverMessage(`🤖 Rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    fallSound.play();
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`🤖 Fell off! -1 point.`);
    showHoverMessage(`🤖 Fell off! -1`);

    if (!flagBonusAwarded[currentPlayerIndex] && prevPos < 8) {
      scores[currentPlayerIndex] += 1;
      bonusSound.play();
      log(`🤖 Passed flag! +1 point.`);
      showHoverMessage(`🤖 Passed flag! +1`);
    }

    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  if (newPos >= 8 && !flagBonusAwarded[currentPlayerIndex]) {
    scores[currentPlayerIndex] += 1;
    bonusSound.play();
    flagBonusAwarded[currentPlayerIndex] = true;
    log(`🤖 Reached flag! +1 point.`);
    showHoverMessage(`🤖 Flag! +1`);
  }

  if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    bonusSound.play();
    log(`🤖 Cliff edge! +3 points.`);
    showHoverMessage(`🤖 Cliff! +3`);
  }

  renderPlayers();

  const shouldContinue = currentRollCount < 2 || (newPos < 7 && Math.random() < 0.6);
  if (shouldContinue && newPos < 9) {
    setTimeout(computerPlay, 1000);
  } else {
    setTimeout(() => {
      log("🤖 Ends turn.");
      endTurn();
    }, 1000);
  }
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
const hoverMessage = document.getElementById("hover-message");

const diceSound = document.getElementById("sound-dice");
const fallSound = document.getElementById("sound-fall");
const bonusSound = document.getElementById("sound-bonus");
const winSound = document.getElementById("sound-win");

let players = [];
let positions = [];
let scores = [];
let flagBonusAwarded = [];
let currentPlayerIndex = 0;
let gameActive = false;
let currentRollCount = 0;
let isComputerTurn = false;

startBtn.addEventListener("click", startGame);
rollBtn.addEventListener("click", rollDice);
endTurnBtn.addEventListener("click", endTurn);
skipTurnBtn.addEventListener("click", skipTurn);
toggleLogBtn.addEventListener("click", () => {
  logContainer.style.display = logContainer.style.display === "block" ? "none" : "block";
});

function startGame() {
  const playerCount = parseInt(playerCountSelect.value);
  players = playerCount === 1 ? ["🔵", "🤖"] : ["🔵", "🔴"];
  positions = [0, 0];
  scores = [0, 0];
  flagBonusAwarded = [false, false];
  currentPlayerIndex = 0;
  gameActive = true;
  currentRollCount = 0;

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
  flagBonusAwarded[currentPlayerIndex] = false;
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
  diceSound.play();
  currentRollCount++;
  rolledInfo.textContent = `🎲 Rolled: ${roll}`;
  showHoverMessage(`🎲 Rolled a ${roll}`);
  log(`Rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    fallSound.play();
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`💥 Fell off! -1 point.`);
    showHoverMessage(`💥 Fell off! -1`);
    
    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  if (newPos >= 8 && !flagBonusAwarded[currentPlayerIndex]) {
    bonusSound.play();
    flagBonusAwarded[currentPlayerIndex] = true;
    log(`🏁 Reached flag!`);
    showHoverMessage(`🏁 Reached flag!`);
  }

  if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    bonusSound.play();
    log(`🌟 Reached cliff edge! +3 points.`);
    showHoverMessage(`🌟 Cliff edge! +3`);
  }

  renderPlayers();

  if (currentRollCount >= 1) endTurnBtn.disabled = false;
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
    winSound.play();
    log(`🎉 Player ${winnerIndex + 1} (${players[winnerIndex]}) wins!`);
    showHoverMessage(`🎉 Player ${winnerIndex + 1} wins!`);
    gameActive = false;
    setTimeout(() => {
      if (confirm("Game over! Restart?")) location.reload();
    }, 1500);
    return;
  }
  startTurn();
}

function skipTurn() {
  log(`⏩ Player ${currentPlayerIndex + 1} skipped turn.`);
  endTurn();
}

function calculateRound() {
  const maxStep = Math.max(...positions);
  positions.forEach((pos, i) => {
    if (pos === maxStep && pos >= 6) {
      scores[i] += 2;
      log(`⭐ Player ${i + 1} was furthest! +2 bonus.`);
      showHoverMessage(`⭐ Player ${i + 1} furthest! +2`);
    }
  });
  renderPlayers();
  log(`📊 Scores: P1: ${scores[0]}, P2: ${scores[1]}`);
}

function computerPlay() {
  if (!gameActive) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  diceSound.play();
  currentRollCount++;
  rolledInfo.textContent = `🤖 Rolled: ${roll}`;
  log(`🤖 Rolled: ${roll}`);
  showHoverMessage(`🤖 Rolled: ${roll}`);

  const prevPos = positions[currentPlayerIndex];
  positions[currentPlayerIndex] += roll;
  const newPos = positions[currentPlayerIndex];

  if (newPos > 9) {
    fallSound.play();
    scores[currentPlayerIndex] = Math.max(0, scores[currentPlayerIndex] - 1);
    log(`🤖 Fell off! -1 point.`);
    showHoverMessage(`🤖 Fell off! -1`);

    positions[currentPlayerIndex] = 0;
    renderPlayers();
    setTimeout(endTurn, 1000);
    return;
  }

  if (newPos >= 8 && !flagBonusAwarded[currentPlayerIndex]) {
    bonusSound.play();
    flagBonusAwarded[currentPlayerIndex] = true;
    log(`🤖 Reached flag!`);
    showHoverMessage(`🤖 Reached flag!`);
  }

  if (newPos === 9) {
    scores[currentPlayerIndex] += 3;
    bonusSound.play();
    log(`🤖 Cliff edge! +3 points.`);
    showHoverMessage(`🤖 Cliff! +3`);
  }

  renderPlayers();

  const shouldContinue = currentRollCount < 2 || (newPos < 7 && Math.random() < 0.6);
  if (shouldContinue && newPos < 9) {
    setTimeout(computerPlay, 1000);
  } else {
    setTimeout(() => {
      log("🤖 Ends turn.");
      endTurn();
    }, 1000);
  }
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