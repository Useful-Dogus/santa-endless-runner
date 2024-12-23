// 게임 설정
const GAME_CONFIG = {
  GAME_DURATION: 30,
};

// 게임 상태
let score = 0;
let gameTimer = GAME_CONFIG.GAME_DURATION;
let gameLoop;
let santa;
let gifts = [];
let obstacles = [];
let username = '';
let highScore = localStorage.getItem('highScore') || 0;

// Canvas 설정
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Collision detection
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.size &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.size &&
    rect1.y + rect1.height > rect2.y
  );
}

// URL에서 사용자 이름 가져오기
function getUsernameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  let name = urlParams.get('username');
  if (!name) {
    window.location.href = 'index.html';
  }
  return name;
}

// 게임 초기화
function initGame() {
  username = getUsernameFromURL();
  score = 0;
  gameTimer = GAME_CONFIG.GAME_DURATION;
  gifts = [];
  obstacles = [];
  santa = new Santa(username);

  startTimer();
  gameLoop = requestAnimationFrame(gameUpdate);
}

// 타이머 관리
function startTimer() {
  const timerInterval = setInterval(() => {
    gameTimer = gameTimer - 1;
    if (gameTimer <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// 게임 종료 처리
function endGame() {
  cancelAnimationFrame(gameLoop);
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over-modal').style.display = 'block';

  // 리더보드 업데이트
  const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboardData.push({
    name: username,
    score: score,
    date: new Date().toLocaleDateString(),
  });
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

// 게임 재시작
function restartGame() {
  document.getElementById('game-over-modal').style.display = 'none';
  initGame();
}

// Spawn game objects
function spawnObjects() {
  if (Math.random() < 0.04) {
    gifts.push(new Gift());
  }
  if (Math.random() < 0.03) {
    obstacles.push(new Icicle());
  }
  if (Math.random() < 0.03) {
    obstacles.push(new Fire());
  }
}

// Update game state
function updateGame() {
  santa.update();

  // Update and filter gifts
  gifts = gifts.filter((gift) => {
    gift.update();
    if (!gift.collision && checkCollision(santa, gift)) {
      score += 10;
      gift.collision = true;
    }
    return gift.x > -gift.size;
  });

  // Update and filter obstacles
  obstacles = obstacles.filter((obstacle) => {
    obstacle.update();
    if (!obstacle.collision && checkCollision(santa, obstacle)) {
      const penalty = obstacle instanceof Icicle ? 10 : 20;
      score = Math.max(0, score - penalty);
      obstacle.collision = true;
    }
    return obstacle.x > -obstacle.size;
  });

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

// Draw game
function drawGame() {
  // Clear canvas
  ctx.fillStyle = '#e1f6ff'; // sky background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw game objects
  gifts.forEach((gift) => gift.draw());
  obstacles.forEach((obstacle) => obstacle.draw());
  santa.draw();

  // Draw scores
  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  ctx.fillText(`High Score: ${highScore}`, 20, 30);
  ctx.fillText(`Score: ${score}`, 20, 60);
  ctx.fillText(`Time: ${gameTimer} 초`, 20, 90);
}

// 게임 루프
function gameUpdate() {
  spawnObjects();
  updateGame();
  drawGame();

  if (gameTimer > 0) {
    gameLoop = requestAnimationFrame(gameUpdate);
  }
}

// 이벤트 리스너
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp') {
    santa.isMovingUp = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp') {
    santa.isMovingUp = false;
  }
});

document.addEventListener('touchstart', (e) => {
  santa.isMovingUp = true;
});

document.addEventListener('touchend', (e) => {
  santa.isMovingUp = false;
});

// 게임 시작
document.addEventListener('DOMContentLoaded', initGame);
