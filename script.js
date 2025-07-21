const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, apple, dx, dy, score, running;

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
    drawCell(segment.x, segment.y, "#0f0");
  }

  drawCell(apple.x, apple.y, "#f00");
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Столкновение со стеной
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount
  ) {
    gameOver();
    return;
  }

  // Столкновение с собой
  if (snake.some((segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Съели яблоко?
  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    scoreEl.textContent = "Очки: " + score;
    apple = spawnApple();
  } else {
    snake.pop();
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
    case "ArrowUp":
      if (dy === 0) [dx, dy] = [0, -1];
      break;
    case "ArrowDown":
      if (dy === 0) [dx, dy] = [0, 1];
      break;
    case "ArrowLeft":
      if (dx === 0) [dx, dy] = [-1, 0];
      break;
    case "ArrowRight":
      if (dx === 0) [dx, dy] = [1, 0];
      break;
  }
}

document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", () => {
  initGame();
});

initGame();
setInterval(gameLoop, 150);
