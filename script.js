const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 10;
const canvasSize = 300;
const speed = 100; // Миллисекунды между кадрами

let snake = [{ x: 50, y: 50 }];
let direction = 'RIGHT';
let food = { x: 70, y: 50 };
let score = 0;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00FF00' : '#008000'; // Голова змейки зелёная, тело темнее
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Рисуем еду
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
        case 'LEFT': head.x -= gridSize; break;
        case 'RIGHT': head.x += gridSize; break;
    }

    // Если змейка съела еду
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Очки: ${score}`;
        generateFood();
    } else {
        snake.pop(); // Убираем хвост
    }

    snake.unshift(head); // Добавляем новый элемент в начало
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function checkCollisions() {
    const head = snake[0];

    // Столкновение с границами
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    // Столкновение с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameLoop() {
    moveSnake();
    drawBoard();

    if (checkCollisions()) {
        alert('Игра окончена! Ваш счёт: ' + score);
        resetGame();
        return;
    }

    setTimeout(gameLoop, speed);
}

function resetGame() {
    snake = [{ x: 50, y: 50 }];
    direction = 'RIGHT';
    score = 0;
    scoreDisplay.textContent = `Очки: ${score}`;
    generateFood();
}

function changeDirection(newDirection) {
    if (
        (newDirection === 'UP' && direction !== 'DOWN') ||
        (newDirection === 'DOWN' && direction !== 'UP') ||
        (newDirection === 'LEFT' && direction !== 'RIGHT') ||
        (newDirection === 'RIGHT' && direction !== 'LEFT')
    ) {
        direction = newDirection;
    }
}

document.getElementById('up').addEventListener('click', () => changeDirection('UP'));
document.getElementById('down').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('left').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('right').addEventListener('click', () => changeDirection('RIGHT'));

// Начинаем игру
resetGame();
gameLoop();
