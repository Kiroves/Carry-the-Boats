let frame = 0; // Current frame
let isAnimating = false; // Animation state
let isStopped = false; // Stop animation state

const frameWidth = 64; // Width of one frame in pixels
const dinoSprite = document.getElementById('dinoSprite');
const totalFrames = () => (isStopped ? 12 : 4);
const startFrame = () => (isStopped ? 4 : 0);
const endFrame = () => (isStopped ? 18 : totalFrames() - 1);
let animationInterval = null;

function updateSpriteFrame() {
  if (frame < endFrame()) {
    frame++;
  } else if (!isStopped) {
    frame = startFrame();
  } else {
    clearInterval(animationInterval);
    isAnimating = false;
  }
  dinoSprite.style.backgroundPosition = `-${frame * frameWidth}px 0`;
}

function startAnimation() {
  if (isAnimating) return;
  isStopped = false;
  frame = startFrame();
  isAnimating = true;
  animationInterval = setInterval(updateSpriteFrame, 200); // Frame update every 200ms
}

function stopAnimation() {
  if (isAnimating) clearInterval(animationInterval);
  isStopped = true;
  frame = 4; // Start frame for "stopped" animation
  isAnimating = true;
  animationInterval = setInterval(updateSpriteFrame, 200);
}

document.getElementById('runAnimation').addEventListener('click', startAnimation);
document.getElementById('stopAnimation').addEventListener('click', stopAnimation);