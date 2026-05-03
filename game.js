// 뱀게임 (Snake Game)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL = 10;
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;

let snake, dir, food, gameLoop, running = false, score = 0;

function initGame() {
  snake = [{ x: 15, y: 12 }, { x: 14, y: 12 }, { x: 13, y: 12 }];
  dir = { x: 1, y: 0 };
  score = 0;
  document.getElementById('score').textContent = 0;
  document.getElementById('game-status').textContent = '시작 버튼을 눌러주세요!';
  placeFood();
  draw();
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS)
  };
}

function draw() {
  ctx.fillStyle = '#fff8fc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 격자
  ctx.strokeStyle = '#ffd6ec';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < COLS; x++)
    for (let y = 0; y < ROWS; y++)
      ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);

  // 뱀
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#ff6eb4' : '#c084fc';
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });

  // 먹이
  ctx.fillStyle = '#ffe566';
  ctx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2);
}

function step() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // 벽 충돌
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }
  // 자기 충돌
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);

  // 먹이 먹기
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  if (running) return;
  running = true;
  document.getElementById('game-status').textContent = '플레이 중! 🐍';
  gameLoop = setInterval(step, 120);
}

function resetGame() {
  clearInterval(gameLoop);
  running = false;
  initGame();
}

function endGame() {
  clearInterval(gameLoop);
  running = false;
  document.getElementById('game-status').textContent = `게임 오버! 최종 점수: ${score} ★`;

  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ff6eb4';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 16);

  ctx.fillStyle = '#ffe566';
  ctx.font = '13px monospace';
  ctx.fillText('SCORE: ' + score, canvas.width / 2, canvas.height / 2 + 12);

  ctx.fillStyle = '#66ffee';
  ctx.font = '11px monospace';
  ctx.fillText('리셋 버튼으로 다시 시작', canvas.width / 2, canvas.height / 2 + 34);
}

// 키보드 조작
document.addEventListener('keydown', e => {
  const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'];
  if (keys.includes(e.key)) e.preventDefault();

  if ((e.key === 'ArrowUp'    || e.key === 'w') && dir.y !== 1)  dir = { x: 0, y: -1 };
  if ((e.key === 'ArrowDown'  || e.key === 's') && dir.y !== -1) dir = { x: 0, y: 1 };
  if ((e.key === 'ArrowLeft'  || e.key === 'a') && dir.x !== 1)  dir = { x: -1, y: 0 };
  if ((e.key === 'ArrowRight' || e.key === 'd') && dir.x !== -1) dir = { x: 1, y: 0 };
});

// 초기화
initGame();
