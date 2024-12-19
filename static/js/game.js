const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Load assets
const playerImg = new Image();
playerImg.src = '../static/images/player_ship.png';

const alienImg = new Image();
alienImg.src = '../static/images/alien_ship1.png';

const shootSound = new Audio('../static/audio/shoot.mp3');
const explosionSound = new Audio('../static/audio/explosion.mp3');

// Player setup
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 5,
    bullets: []
};

// Enemy setup
const enemies = [];
for (let i = 0; i < 6; i++) {
    enemies.push({
        x: i * 100 + 50,
        y: 50,
        width: 40,
        height: 40,
        alive: true
    });
}

// Game logic
let score = 0;
let gameOver = false;

// Draw player
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.alive) {
            ctx.drawImage(alienImg, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

// Draw bullets
function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        bullet.y -= 7;

        // Remove bullet if out of canvas
        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }

        // Check collision with enemies
        enemies.forEach(enemy => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 10 > enemy.y &&
                enemy.alive
            ) {
                enemy.alive = false;
                player.bullets.splice(index, 1);
                explosionSound.play();
                score += 10;
            }
        });
    });
}

// Game loop
function updateGame() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Score: ' + score, canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawBullets();

    requestAnimationFrame(updateGame);
}

// Move player
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (e.key === ' ') {
        player.bullets.push({ x: player.x + 22, y: player.y });
        shootSound.play();
    }
});

// Start the game
updateGame();
