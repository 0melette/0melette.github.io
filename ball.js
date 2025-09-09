// Ball Playground Code
const ballCanvas = document.getElementById('ballCanvas');
const ballCtx = ballCanvas.getContext('2d');
const balls = [];
let ballsVisible = false;
let ballsDragging = false;
let dragBall = null;
let ballMouseX = 0;
let ballMouseY = 0;
let ballAnimationId;

// Resize ball canvas to full window
function resizeBallCanvas() {
  ballCanvas.width = window.innerWidth;
  ballCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeBallCanvas);
resizeBallCanvas();

// Ball class with retro styling
class RetloBall {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.radius = radius;
    this.color = color;
    this.isDragging = false;
    this.gravity = 0.15;
    this.friction = 0.98;
    this.bounce = 0.7;
  }

  update() {
    if (!this.isDragging) {
      // Apply gravity
      this.vy += this.gravity;
      
      // Apply velocity
      this.x += this.vx;
      this.y += this.vy;
      
      // Apply friction
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      // Bounce off walls
      if (this.x + this.radius > ballCanvas.width) {
        this.x = ballCanvas.width - this.radius;
        this.vx *= -this.bounce;
      }
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -this.bounce;
      }
      if (this.y + this.radius > ballCanvas.height) {
        this.y = ballCanvas.height - this.radius;
        this.vy *= -this.bounce;
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy *= -this.bounce;
      }
    }

    // Check collisions with other balls
    this.checkCollisions();
  }

  checkCollisions() {
    for (let other of balls) {
      if (other === this) continue;
      
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = this.radius + other.radius;
      
      if (distance < minDistance) {
        // Simple collision response
        const angle = Math.atan2(dy, dx);
        const targetX = this.x + Math.cos(angle) * minDistance;
        const targetY = this.y + Math.sin(angle) * minDistance;
        
        const ax = (targetX - other.x) * 0.03;
        const ay = (targetY - other.y) * 0.03;
        
        this.vx -= ax;
        this.vy -= ay;
        other.vx += ax;
        other.vy += ay;
      }
    }
  }

  draw() {
    ballCtx.save();
    
    // Draw retro-style shadow (offset black circle)
    ballCtx.fillStyle = '#808080';
    ballCtx.beginPath();
    ballCtx.arc(this.x + 2, this.y + 2, this.radius, 0, Math.PI * 2);
    ballCtx.fill();
    
    // Draw main ball with retro border effect
    ballCtx.fillStyle = this.color;
    ballCtx.beginPath();
    ballCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ballCtx.fill();
    
    // Draw highlight (top-left)
    ballCtx.fillStyle = '#ffffff';
    ballCtx.beginPath();
    ballCtx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
    ballCtx.fill();
    
    ballCtx.restore();
  }

  isPointInside(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }
}

// Ball configurations with retro colors
const retroBallConfigs = [
  { color: '#ff0000', radius: 25 }, // Red
  { color: '#00ff00', radius: 28 }, // Green
  { color: '#0000ff', radius: 26 }, // Blue
  { color: '#ffff00', radius: 30 }, // Yellow
  { color: '#ff00ff', radius: 27 }, // Magenta
  { color: '#00ffff', radius: 29 }, // Cyan
  { color: '#800080', radius: 24 }, // Purple
  { color: '#ffa500', radius: 31 }  // Orange
];

function spawnRetroBall() {
  const config = retroBallConfigs[Math.floor(Math.random() * retroBallConfigs.length)];
  const x = Math.random() * (ballCanvas.width - config.radius * 2) + config.radius;
  const y = Math.random() * (ballCanvas.height - config.radius * 2) + config.radius;
  
  balls.push(new RetloBall(x, y, config.radius, config.color));
  updateBallCounter();
}

function clearAllBalls() {
  balls.length = 0;
  updateBallCounter();
}

function updateBallCounter() {
  document.getElementById('ballCounter').textContent = balls.length;
}

function showBallControls() {
  console.log('Showing ball controls');
  ballsVisible = true;
  document.getElementById('ballControls').style.display = 'flex';
  ballCanvas.classList.add('interactive');
  const ballsBtn = document.getElementById('ballsButton');
  ballsBtn.setAttribute('data-active', 'true');
  
  // Debug canvas properties
  console.log('Canvas dimensions:', ballCanvas.width, 'x', ballCanvas.height);
  console.log('Canvas classes:', ballCanvas.className);
  console.log('Canvas z-index:', getComputedStyle(ballCanvas).zIndex);
  
  // Spawn 8 random balls
  for (let i = 0; i < 8; i++) {
    addBall();
  }
  
  console.log('Spawned balls:', balls.length);
  
  if (!ballAnimationId) {
    animateBalls();
  }
}

function hideBallControls() {
  console.log('Hiding ball controls');
  ballsVisible = false;
  document.getElementById('ballControls').style.display = 'none';
  ballCanvas.classList.remove('interactive');
  const ballsBtn = document.getElementById('ballsButton');
  ballsBtn.setAttribute('data-active', 'false');
  
  // Clear all balls
  clearAllBalls();
  
  // Immediately clear the canvas
  ballCtx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
  
  // Stop any dragging
  if (ballsDragging && dragBall) {
    dragBall.isDragging = false;
    dragBall = null;
    ballsDragging = false;
  }
  
  // Reset animation ID so it can restart properly
  ballAnimationId = null;
}

function addBall() {
  const config = retroBallConfigs[Math.floor(Math.random() * retroBallConfigs.length)];
  const x = Math.random() * (ballCanvas.width - config.radius * 2) + config.radius;
  const y = Math.random() * (ballCanvas.height - config.radius * 2) + config.radius;
  
  balls.push(new RetloBall(x, y, config.radius, config.color));
  updateBallCounter();
}

function removeBall() {
  if (balls.length > 0) {
    balls.pop();
    updateBallCounter();
  }
}

// Mouse/touch event handlers for balls
function getBallMousePos(e) {
  const rect = ballCanvas.getBoundingClientRect();
  return {
    x: (e.clientX || e.touches[0].clientX) - rect.left,
    y: (e.clientY || e.touches[0].clientY) - rect.top
  };
}

// Test if canvas is receiving events at all
ballCanvas.addEventListener('click', (e) => {
  console.log('Canvas clicked! Event received');
});

ballCanvas.addEventListener('mousedown', (e) => {
  console.log('Mouse down event fired, ballsVisible:', ballsVisible, 'balls.length:', balls.length);
  if (!ballsVisible) return;
  
  const pos = getBallMousePos(e);
  ballMouseX = pos.x;
  ballMouseY = pos.y;
  console.log('Mouse position:', pos.x, pos.y);
  
  // Check if clicking on a ball
  for (let i = balls.length - 1; i >= 0; i--) {
    console.log('Checking ball', i, 'at position:', balls[i].x, balls[i].y, 'radius:', balls[i].radius);
    if (balls[i].isPointInside(ballMouseX, ballMouseY)) {
      console.log('Ball clicked, starting drag');
      ballsDragging = true;
      dragBall = balls[i];
      dragBall.isDragging = true;
      ballCanvas.style.cursor = 'grabbing';
      // Move ball to end of array (draw on top)
      balls.splice(i, 1);
      balls.push(dragBall);
      break;
    }
  }
});

ballCanvas.addEventListener('mousemove', (e) => {
  if (!ballsVisible) return;
  
  const pos = getBallMousePos(e);
  if (ballsDragging && dragBall) {
    console.log('Dragging ball to:', pos.x, pos.y);
    dragBall.x = pos.x;
    dragBall.y = pos.y;
    dragBall.vx = pos.x - ballMouseX;
    dragBall.vy = pos.y - ballMouseY;
  } else {
    // Check if hovering over a ball for cursor feedback
    let hoveringOverBall = false;
    for (let ball of balls) {
      if (ball.isPointInside(pos.x, pos.y)) {
        hoveringOverBall = true;
        break;
      }
    }
    ballCanvas.style.cursor = hoveringOverBall ? 'grab' : 'default';
  }
  ballMouseX = pos.x;
  ballMouseY = pos.y;
});

ballCanvas.addEventListener('mouseup', () => {
  if (ballsDragging && dragBall) {
    console.log('Mouse up, ending drag');
    dragBall.isDragging = false;
    dragBall = null;
    ballsDragging = false;
    ballCanvas.style.cursor = 'default';
  }
});

// Ball animation loop
function animateBalls() {
  ballCtx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
  
  if (ballsVisible && balls.length > 0) {
    for (let ball of balls) {
      ball.update();
      ball.draw();
    }
    ballAnimationId = requestAnimationFrame(animateBalls);
  } else {
    // Clear canvas when balls are hidden
    ballCtx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
    if (ballsVisible) {
      ballAnimationId = requestAnimationFrame(animateBalls);
    } else {
      ballAnimationId = null;
    }
  }
}

// Event listeners for ball controls
document.getElementById('ballPlus').addEventListener('click', addBall);
document.getElementById('ballMinus').addEventListener('click', removeBall);
document.getElementById('ballsButton').addEventListener('click', () => {
  if (ballsVisible) {
    hideBallControls();
  } else {
    showBallControls();
  }
});

// Initialize (no balls by default)
updateBallCounter();