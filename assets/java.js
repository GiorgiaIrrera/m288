let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let rows = 20;
let cols = 20;
let snake = [{ x: 18, y: 2 }];
let food;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;
let direction = "LEFT";
let foodcollected = false;
let score = 0;  // Initialer Score
 
// Lade den Score aus dem lokalen Speicher
let storedScore = localStorage.getItem('snakeScore');
if (storedScore) {
    score = parseInt(storedScore, 10);
}
updateScoreDisplay();
 
let foodImageLoaded = false; // Flag, ob das Bild geladen ist
const foodImage = new Image(); // Erstelle ein neues Image-Objekt
foodImage.onload = function() {
    foodImageLoaded = true; // Setze die Flag auf true, wenn das Bild geladen ist
};
foodImage.src = "/assets/logo/sbwnm.png"; // Setze den Pfad zum Bild
 
function updateScoreDisplay() {
    document.getElementById('score').textContent = 'Score: ' + score;
}
 
placeFood();
setInterval(gameLoop, 250);
document.addEventListener('keydown', keyDown);
 
function draw() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    snake.forEach(part => {
        add(part.x, part.y);
    });
    if (foodImageLoaded) {
        ctx.drawImage(foodImage, food.x * cellWidth, food.y * cellHeight, cellWidth, cellHeight);
    }
    requestAnimationFrame(draw);
}
 
function placeFood() {
    let randomX, randomY, foodPlacementInvalid;
    do {
        foodPlacementInvalid = false;
        randomX = Math.floor(Math.random() * cols);
        randomY = Math.floor(Math.random() * rows);
        snake.forEach(function(part) {
            if (part.x === randomX && part.y === randomY) {
                foodPlacementInvalid = true;
            }
        });
    } while (foodPlacementInvalid);
 
    food = { x: randomX, y: randomY };
}
 
function add(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}
 
function shiftSnake() {
    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') newHead.x -= 1;
    if (direction === 'UP') newHead.y -= 1;
    if (direction === 'RIGHT') newHead.x += 1;
    if (direction === 'DOWN') newHead.y += 1;
    snake.unshift(newHead);
    if (!foodcollected) {
        snake.pop();
    } else {
        foodcollected = false;
        score++;
        localStorage.setItem('snakeScore', score.toString());
        updateScoreDisplay();
    }
}
 
function gameLoop() {
    if (testGameOver()) {
        snake = [{ x: 18, y: 2 }];
        direction = "LEFT";
        score = 0;
        localStorage.setItem('snakeScore', score.toString());
        updateScoreDisplay();
        placeFood();
    } else {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            foodcollected = true;
            placeFood();
        }
        shiftSnake();
        draw();
    }
}
 
function testGameOver() {
    let head = snake[0];
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}
 
function keyDown(e) {
    if (e.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (e.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (e.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (e.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}
 
draw(); // Starte den Zeichenprozess einmalig