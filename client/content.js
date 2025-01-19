console.log("Focusaurus content script loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'spawnDino') {
    spawnDino();
  }
});

function spawnDino() {
  // Create a div for the dinosaur sprite
  const dinoSprite = document.createElement('div');
  dinoSprite.style.width = '64px'; // Width of one frame
  dinoSprite.style.height = '64px'; // Height of one frame
  dinoSprite.style.backgroundImage = `url(${chrome.runtime.getURL("public/dinosprite.png")})`;
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
  let direction = 1; // Start moving left

  // Function to update the sprite's frame
  function updateDinoFrame() {
    if (!isAnimating) return; // Stop updating if not animating
    dinoSprite.style.backgroundPosition = `-${frame * frameWidth}px 0`; // Move background position
    frame = (frame + 1) % totalFrames; // Cycle through frames
    let currentRight = parseInt(dinoSprite.style.right);
    currentRight += direction * 15;

    if (currentRight < 0 || currentRight > window.innerWidth - frameWidth) {
      direction *= -1; // Reverse direction
    }

    dinoSprite.style.right = `${currentRight}px`; // Move dinosaur
  }

  // Start the animation loop
  const animationInterval = setInterval(updateDinoFrame, 100); // Adjust timing for frame speed

  // Optional: Add a way to stop/start animation
  dinoSprite.addEventListener('click', () => {
    isAnimating = !isAnimating; // Toggle animation state
    if (isAnimating) {
      console.log('Dinosaur animation resumed.');
    } else {
      console.log('Dinosaur animation paused.');
    }
  });
}
