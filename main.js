const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const backgroundGeometry = new THREE.PlaneGeometry(1000, 1000);
const backgroundMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000
});
const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
backgroundPlane.position.z = -500;
scene.add(backgroundPlane);
const backgroundMusic = document.getElementById('background');
const gameOverSound = document.getElementById('gameOver');
const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const lines = [];
for (let z = -500; z < 0; z += 5) {
  const lineGeometry = new THREE.PlaneGeometry(0.2, 3);
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const line = new THREE.Mesh(lineGeometry, lineMaterial);

  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 0.01, z);
  scene.add(line);
  lines.push(line);
}
const playerTexture = new THREE.TextureLoader().load('bg2.jpg');
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ map: playerTexture });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.5, 0);
scene.add(ball);
const groundGeometry = new THREE.PlaneGeometry(13, 500);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);
let color = 'e3ca00';
function newColor() {
  color = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  wallMaterial.color.set(`#${color}`);
}
const wallMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(`#${color}`)
});
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 50, 700), wallMaterial);
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 50, 700), wallMaterial);
leftWall.position.set(-10, 0.5, -100);
rightWall.position.set(10, 0.5, -100);
scene.add(leftWall, rightWall);
const obstacles = [];

function createObstacle(zPosition) {
  const obstacleGeometry = new THREE.BoxGeometry(2, 2, 1);
  const obstaclesBg = new THREE.TextureLoader().load('bg1.jpeg');
  const obstacleMaterial = new THREE.MeshStandardMaterial({ map: obstaclesBg, color: 0xf50000 });
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  obstacle.position.set((Math.random() - 0.5) * 10, 0.3, zPosition);
  obstacle.velocityX = (Math.random() - 0.5) * 0.1;
  scene.add(obstacle);
  obstacles.push(obstacle);
}
for (let i = -20; i > -100; i -= 5) {
  createObstacle(i);
}
const powerUpGeometry = new THREE.TetrahedronGeometry(0.5);
const powerUpMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
resetPowerUpPosition();
scene.add(powerUp);
function resetPowerUpPosition() {
  powerUp.position.set((Math.random() - 0.5) * 8, 0.5, -50 - Math.random() * 50);
}
const diamondGeometry = new THREE.TetrahedronGeometry(0.5);
const diamondMaterial = new THREE.MeshStandardMaterial({color: 0x00e8f5});
const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
resetDiamondPosition()
scene.add(diamond);
function resetDiamondPosition() {
  diamond.position.set((Math.random() - 0.5) * 8, 0.5, -50 -Math.random() * 50);
}
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 5);
scene.add(directionalLight);
camera.position.set(0, 5, 15);
camera.lookAt(0, 5, 5);
let playerVelocityX = 0;
let gameSpeed = 0.1;
let score = 0;
let diamonds = localStorage.getItem('diamonds');
diamonds = diamonds ? parseInt(diamonds) : 0;
let powerUpActive = false;
let powerUpTimer = 0;
let isGameOver = false;
let isDragging = false;
let startX = 0;
let startBallX = 0;
function animateLines() {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    line.position.z += gameSpeed;
    if (line.position.z > 0) {
      line.position.z = -500;
    }
  }
}
document.addEventListener('touchstart', (event) => {
  isDragging = true;
  startX = event.touches[0].clientX;
  startBallX = ball.position.x;
});

document.addEventListener('touchmove', (event) => {
  if (isDragging) {
    const deltaX = event.touches[0].clientX - startX;
    ball.position.x = startBallX + deltaX / 50;
    if (ball.position.x < -4.8) ball.position.x = -4.8;
    if (ball.position.x > 4.8) ball.position.x = 4.8;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
});
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart');

restartButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  gameSpeed = '';
  gameSpeed = 0.1;
  powerUpActive = false;
  powerUpTimer = 0;
  ball.position.set(0, 0.5, 0);
  obstacles.forEach((o, i) => (o.position.z = -10 - i * 10));
  resetPowerUpPosition();
  document.getElementById('play').style.display = 'block';
  gameOverScreen.style.display = 'none';
  newColor();
  backgroundMusic.play();
  animate();
});

let magneticBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 })
);
magneticBox.visible = false;
scene.add(magneticBox);

let isPaused = false;
const pauseResumeButton = document.getElementById('play');

pauseResumeButton.addEventListener('click', () => {
  isPaused = !isPaused;

  if (isPaused) {
    pauseResumeButton.innerHTML = '<i class="bx bx-play"></i>';
    backgroundMusic.pause();
  } else {
    pauseResumeButton.innerHTML = '<i class="bx bx-pause"></i>';
    backgroundMusic.play();
    animate();
  }
});

function animate() {
  if (isGameOver || isPaused) return;
  requestAnimationFrame(animate);

  gameSpeed += 0.0001;
  ball.rotation.x += -gameSpeed;
  magneticBox.position.copy(ball.position);

  if (ball.position.x <= -4.8) {
    ball.position.x = -4.8;
  } else if (ball.position.x >= 4.8) {
    ball.position.x = 4.8;
  }

  ground.position.z += gameSpeed;
  if (ground.position.z > 10) ground.position.z = 0;

  for (let obstacle of obstacles) {
    obstacle.position.z += gameSpeed;
    obstacle.position.x += obstacle.velocityX;

    if (obstacle.position.x <= -4.8 || obstacle.position.x >= 4.8) {
      obstacle.velocityX = -obstacle.velocityX;
      obstacle.position.x += obstacle.velocityX;
    }
    if (obstacle.position.z > 5) {
      obstacle.position.z = -95;
      obstacle.position.x = (Math.random() - 0.5) * 8;
      obstacle.velocityX = (Math.random() - 0.5) * 0.1;
      score++;
    }
    if(
      Math.abs(ball.position.x - diamond.position.x) < 0.9 &&
      Math.abs(ball.position.z - diamond.position.z) < 0.9
      ) {
        diamonds += 5;
        localStorage.setItem('diamonds', diamonds);
        document.getElementById('diamond').innerText = diamonds;
        resetDiamondPosition()
      }
    if (
      Math.abs(ball.position.x - obstacle.position.x) < 1.3 &&
      Math.abs(ball.position.z - obstacle.position.z) < 1.3
    ) {
      if (powerUpActive) {
        obstacle.position.z = -95;
        obstacle.position.x = (Math.random() - 0.5) * 8;
        obstacle.velocityX = (Math.random() - 0.5) * 0.1;
        score += 5;
      } else {
        endGame();
      }
    }

    if (powerUpActive) {
      const distance = ball.position.distanceTo(obstacle.position);

      if (distance < 5) {
        const attractionStrength = Math.max(0.05, (10 - distance) * 0.1);
        const direction = new THREE.Vector3().subVectors(ball.position, obstacle.position).normalize();
        obstacle.position.add(direction.multiplyScalar(attractionStrength));
      }
    }
  }
  powerUp.position.z += gameSpeed;
  diamond.position.z += gameSpeed;
  if(diamond.position.z > 5) {
    resetDiamondPosition()
  }
  if (powerUp.position.z > 5) {
    resetPowerUpPosition();
  }
  if (
    Math.abs(ball.position.x - powerUp.position.x) < 0.75 &&
    Math.abs(ball.position.z - powerUp.position.z) < 0.75
  ) {
    powerUpActive = true;
    powerUpTimer = Math.min(600, powerUpTimer + 150);
    resetPowerUpPosition();
    magneticBox.visible = true;
  }
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) {
      powerUpActive = false;
      magneticBox.visible = false;
    }
  }

  scoreDisplay.innerHTML = `${powerUpActive ? `(${powerUpTimer})` : ""}`;
  document.getElementById('center-score').innerText = score;
  document.getElementById('diamond').innerText = '💎' + localStorage.getItem('diamonds');
  animateLines();
  renderer.render(scene, camera);
}
function endGame() {
  isGameOver = true;
  powerUpActive = false;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  gameOverSound.play();
  let highScore = localStorage.getItem('highScore');
  if (!highScore || score > highScore) {
    localStorage.setItem('highScore', score);
    highScore = score;
  }
  document.getElementById('hight-score').innerText = 'High Score: ' + highScore;
  document.getElementById('score').innerText = 'Score: ' + score;
  document.getElementById('diamond').innerText = diamonds;
  document.getElementById('lastScore').innerText = 'Score: ' + score;
  document.getElementById('play').style.display = 'none';
  gameOverScreen.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  const highScore = localStorage.getItem('highScore');
  if (highScore) {
    document.getElementById('hight-score').innerText = 'High Score: ' + highScore;
    document.getElementById('hight').innerHTML = `Score-kaaga Sare waa: ${highScore}`;
  }
  document.getElementById('diamond').innerText = '💎'+localStorage.getItem('diamonds');
  const soundButton = document.getElementById('sound');
  const currentSound = localStorage.getItem('sound') || 'true';
  localStorage.setItem('sound', currentSound);
  updateSoundIcon(currentSound);

  soundButton.addEventListener('click', () => {
    const currentSound = localStorage.getItem('sound');
    const newSound = currentSound === 'true' ? 'false' : 'true';
    localStorage.setItem('sound', newSound);
    updateSoundIcon(newSound);
    applyMute(newSound);
  });

  // Apply initial sound setting
  applyMute(currentSound);
});

function updateSoundIcon(state) {
  const soundButton = document.getElementById('sound');
  if (state === 'true') {
    soundButton.innerHTML = `<i class='bx bxs-volume-full'></i>`;
  } else {
    soundButton.innerHTML = `<i class='bx bx-volume-mute'></i>`;
  }
}

function applyMute(state) {
  const isMuted = state === 'false';
  gameOverSound.muted = isMuted;
  backgroundMusic.muted = isMuted;
  gameOverSound.currentTime = 0;
  backgroundMusic.currentTime = 0;
}
document.getElementById('start-button').addEventListener('click', function () {
  backgroundMusic.play();
  document.getElementById('start-game').style.display = 'none';
  document.getElementById('help').style.display = 'none';
  document.getElementById('play').style.display = 'block';
  newColor();
  animate();
});
document.getElementById('help').addEventListener('click', function () {
  document.getElementById('content').style.display = 'block';
});
document.getElementById('close').addEventListener('click', function () {
  document.getElementById('content').style.display = 'none';
});