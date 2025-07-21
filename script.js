const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");

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

  // Проверка на столкновение со стеной или собой
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

function handleKey(e) {
  switch (e.key) {
    case "ArrowUp": if (dy === 0) [dx, dy] = [0, -1]; break;
    case "ArrowDown": if (dy === 0) [dx, dy] = [0, 1]; break;
    case "ArrowLeft": if (dx === 0) [dx, dy] = [-1, 0]; break;
    case "ArrowRight": if (dx === 0) [dx, dy] = [1, 0]; break;
  }
}

function setupSwipeControls() {
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!running) return;

    const touch = e.touches[0];
    const dxTouch = touch.clientX - touchStartX;
    const dyTouch = touch.clientY - touchStartY;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
      if (dxTouch > 30 && dx === 0) {
        [dx, dy] = [1, 0];
      } else if (dxTouch < -30 && dx === 0) {
        [dx, dy] = [-1, 0];
      }
    } else {
      if (dyTouch > 30 && dy === 0) {
        [dx, dy] = [0, 1];
      } else if (dyTouch < -30 && dy === 0) {
        [dx, dy] = [0, -1];
      }
    }
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
}

// Инициализация
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", () => {
  initGame();
});
setupSwipeControls();

highScore = parseInt(localStorage.getItem("highScore")) || 0;
highscoreEl.textContent = "Макс: " + highScore;

initGame();
setInterval(gameLoop, 120);
