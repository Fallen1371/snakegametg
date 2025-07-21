const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");
const controlButtons = document.querySelectorAll(".ctrl-btn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, apple, dx, dy, score, running, highScore;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  apple = spawnApple();
  running = true;
  scoreEl.textContent = "Очки: 0";
}

function spawnApple() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
}

function drawGame() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let segment of snake) {
    drawCell(segment.x, segment.y, "#00ff66");
  }

  drawCell(apple.x, apple.y, "#ff3333");
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some((segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    updateScore();
    apple = spawnApple();
  } else {
    snake.pop();
  }
}

function updateScore() {
  scoreEl.textContent = "Очки: " + score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highscoreEl.textContent = "Макс: " + highScore;
  }
}

function gameOver() {
  running = false;
  alert("Игра окончена! Ваш счёт: " + score);
}

function gameLoop() {
  if (!running) return;
  moveSnake();
  drawGame();
}

function handleDirection(dir) {
  switch (dir) {
    case "up": if (dy === 0) [dx, dy] = [0, -1]; break;
    case "down": if (dy === 0) [dx, dy] = [0, 1]; break;
    case "left": if (dx === 0) [dx, dy] = [-1, 0]; break;
    case "right": if (dx === 0) [dx, dy] = [1, 0]; break;
  }
}

function handleKey(e) {
  switch (e.key) {
    case "ArrowUp": handleDirection("up"); break;
    case "ArrowDown": handleDirection("down"); break;
    case "ArrowLeft": handleDirection("left"); break;
    case "ArrowRight": handleDirection("right"); break;
  }
}

// События
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", () => initGame());

controlButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    handleDirection(btn.dataset.dir);
  });
});

// Старт
highScore = parseInt(localStorage.getItem("highScore")) || 0;
highscoreEl.textContent = "Макс: " + highScore;

initGame();
setInterval(gameLoop, 120);
