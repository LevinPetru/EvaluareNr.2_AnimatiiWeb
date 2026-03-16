const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 700;

let hp = 100;
const hpElement = document.getElementById("hp");

let gameRunning = false;
let enemies = [];
let bullets = [];

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 40,
  speed: 5,
  emoji: "🚀"
};

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Click = trage glonț
canvas.addEventListener("click", e => {
  bullets.push({
    x: player.x,
    y: player.y,
    radius: 5,
    color: "yellow",
    speed: 10,
    targetX: e.offsetX,
    targetY: e.offsetY
  });
});

// Spawn inamic
function spawnEnemy() {
  const isSmall = Math.random() < 0.7;
  const size = isSmall ? 30 : 50;
  const hp = isSmall ? 1 : 2;
  const emoji = isSmall ? "👾" : "💀";

  const side = Math.floor(Math.random() * 4);
  let x, y;
  if (side === 0) { x = 0; y = Math.random() * canvas.height; }
  else if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; }
  else if (side === 2) { x = Math.random() * canvas.width; y = 0; }
  else { x = Math.random() * canvas.width; y = canvas.height; }

  enemies.push({ x, y, size, hp, speed: 2, emoji });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  });
}

function drawEnemies() {
  ctx.font = "30px Arial";
  enemies.forEach(enemy => {
    ctx.fillText(enemy.emoji, enemy.x, enemy.y);
  });
}

// Gloanțe
function moveBullets() {
  bullets.forEach((bullet, index) => {
    const dx = bullet.targetX - bullet.x;
    const dy = bullet.targetY - bullet.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < bullet.speed) {
      bullets.splice(index, 1); // elimină glonțul când ajunge la țintă
    } else {
      bullet.x += (dx / dist) * bullet.speed;
      bullet.y += (dy / dist) * bullet.speed;
    }
  });
}

function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI*2);
    ctx.fill();
  });
}

// Coliziuni
function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < enemy.size/2 + bullet.radius) {
        enemy.hp--;
        bullets.splice(bIndex, 1);
        if (enemy.hp <= 0) enemies.splice(eIndex, 1);
      }
    });
  });

  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < enemy.size/2 + player.size/2) {
      hp -= 1;
      hpElement.textContent = hp;
      if (hp <= 0) gameRunning = false;
    }
  });
}

// Player
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
}

function drawPlayer() {
  ctx.font = "40px Arial";
  ctx.fillText(player.emoji, player.x, player.y);
}

// Loop
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();

  moveEnemies();
  drawEnemies();

  moveBullets();
  drawBullets();

  checkCollisions();

  requestAnimationFrame(gameLoop);
}

// Controale
document.getElementById("startBtn").addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    setInterval(spawnEnemy, 2000);
    gameLoop();
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  gameRunning = false;
});

document.getElementById("restartBtn").addEventListener("click", () => {
  hp = 100;
  hpElement.textContent = hp;
  enemies = [];
  bullets = [];
  player.x = canvas.width/2;
  player.y = canvas.height/2;
  gameRunning = true;
  gameLoop();
});
