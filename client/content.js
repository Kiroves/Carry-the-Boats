console.log("Focusaurus content script loaded.");

// Create a div for the dinosaur sprite
const dinoSprite = document.createElement('div');
dinoSprite.style.width = '64px'; // Width of one frame
dinoSprite.style.height = '64px'; // Height of one frame
// dinoSprite.style.backgroundImage = chrome.runtime.getURL("public/dinosprite.png"); // Replace with your sprite sheet
dinoSprite.style.backgroundImage = `url(${chrome.runtime.getURL("public/dinosprite.png")})`;

// dinoSprite.style.backgroundColor = 'blue';
dinoSprite.style.backgroundRepeat = 'no-repeat';
dinoSprite.style.position = 'fixed';
dinoSprite.style.bottom = '0';
dinoSprite.style.right = '0';
document.body.appendChild(dinoSprite);

// Animation state variables
let frame = 0; // Current frame
let isAnimating = true; // Start with animation enabled
const frameWidth = 64; // Width of one frame in pixels
const totalFrames = 4; // Number of frames in the sprite sheet

// Function to update the sprite's frame
function updateDinoFrame() {
  if (!isAnimating) return; // Stop updating if not animating
  dinoSprite.style.backgroundPosition = `-${frame * frameWidth}px 0`; // Move background position
  frame = (frame + 1) % totalFrames; // Cycle through frames
  dinoSprite.style.right = `${parseInt(dinoSprite.style.right) + 5}px`; // Move dinosaur
}

// Start the animation loop
const animationInterval = setInterval(updateDinoFrame, 200); // Adjust timing for frame speed

// Optional: Add a way to stop/start animation
dinoSprite.addEventListener('click', () => {
  isAnimating = !isAnimating; // Toggle animation state
  if (isAnimating) {
    console.log('Dinosaur animation resumed.');
  } else {
    console.log('Dinosaur animation paused.');
  }
});
