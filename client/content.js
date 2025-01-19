console.log("Focusaurus content script loaded.");

// Add font and styles at the start of the file
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @font-face {
    font-family: 'ChiFont';
    src: url('${chrome.runtime.getURL("public/chi.ttf")}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  .text-box {
    background-color: #D1CEB2;
    border: 2px solid #000;
    padding: 1rem;
    font-size: 22px;  /* Hardcoded font size */
    line-height: 1.0;  /* Reduced from 1.4 */
    letter-spacing: -1.0px;  /* Add negative letter-spacing for tighter kerning */
    box-shadow: 3px 3px 0 1px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(styleSheet);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'spawnDino') {
        spawnDino();
    } else if (request.action === 'sayAlert') {
        sayAlert(request.message);
    } else if (request.action === 'sayHello') {
        sayAlert("Hello World, I'm Blu!");
    }
});

let isAnimating = true; // Start with animation enabled
let dinoRight = 0;
let direction = 1; // Start moving left 

const frameWidth = 64; // Width of one frame in pixels

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let animationInterval = null;

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
    dinoSprite.style.transform = 'scaleX(-1)';
    document.body.appendChild(dinoSprite);

    // Animation state variables
    let frame = 0; // Current frame
    const totalFrames = 4; // Number of frames in the sprite sheet

    // Function to update the sprite's frame
    function updateDinoFrame() {
        if (!isAnimating) return; // Stop updating if not animating
        dinoSprite.style.backgroundPosition = `-${frame * frameWidth}px 0`; // Move background position
        frame = (frame + 1) % totalFrames; // Cycle through frames
        let currentRight = parseInt(dinoSprite.style.right);
        currentRight += direction * 5;

        if (currentRight < 0 || currentRight > window.innerWidth - frameWidth) {
            direction *= -1; // Reverse direction
            dinoSprite.style.transform = direction === 1 ? 'scaleX(-1)' : 'scaleX(1)'; // Flip sprite
        }

        dinoRight = currentRight;
        dinoSprite.style.right = `${currentRight}px`; // Move dinosaur
    }

    // Start the animation loop
    animationInterval = setInterval(updateDinoFrame, 200); // Adjust timing for frame speed

    dinoSprite.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragOffsetX = event.clientX - dinoSprite.getBoundingClientRect().right + 90; // Adjust offset
        dragOffsetY = event.clientY - dinoSprite.getBoundingClientRect().bottom + 75; // Adjust offset
        direction /= 1000000; // Divide direction by 1,000,000
        clearInterval(animationInterval);
        animationInterval = setInterval(updateDinoFrame, 10); // Faster animation while dragging
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            dinoSprite.style.right = `${window.innerWidth - event.clientX - dragOffsetX}px`;
            dinoSprite.style.bottom = `${window.innerHeight - event.clientY - dragOffsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            direction *= 1000000; // Multiply direction back
            clearInterval(animationInterval);
            animationInterval = setInterval(updateDinoFrame, 200); // Restore normal animation speed
            fallToBottom();
        }
    });

    function fallToBottom() {
        const fallInterval = setInterval(() => {
            const currentBottom = parseInt(dinoSprite.style.bottom);
            if (currentBottom > 0) {
                dinoSprite.style.bottom = `${currentBottom - 5}px`;
            } else {
                clearInterval(fallInterval);
                dinoSprite.style.bottom = '0';
                clearInterval(animationInterval);
                animationInterval = setInterval(updateDinoFrame, 200); // Ensure normal speed after falling
            }
        }, 50);
    }

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

function sayAlert(message) {
    const dinoSprite = document.querySelector('div[style*="background-image"]');
    if (!dinoSprite) return;

    isAnimating = false;

    const boxWidth = message.length < 20 ? window.innerWidth / 4 : window.innerWidth / 2 - frameWidth;

    const textBubble = document.createElement('div');
    textBubble.innerText = message;  // Use the passed message instead of 'Hello, World!'
    textBubble.style.position = 'fixed';
    textBubble.style.bottom = `${frameWidth}px`;
    textBubble.style.right = `${(dinoRight + frameWidth / 2) < (window.innerWidth / 2) ? dinoRight + frameWidth : (dinoRight - boxWidth)}px`;
    textBubble.style.width = `${boxWidth}px`;
    textBubble.style.zIndex = '9999';
    textBubble.className = 'text-box';
    textBubble.style.fontFamily = 'ChiFont, sans-serif';
    textBubble.style.textAlign = direction === 1 ? 'left' : 'right';
    textBubble.style.fontSize = '2rem';  // Increased font size
    textBubble.style.fontWeight = 'bold';  // Make text bold
    textBubble.style.letterSpacing = '-1.5px';  // Reduce space between characters

    document.body.appendChild(textBubble);

    setTimeout(() => {
        document.body.removeChild(textBubble);
        isAnimating = true;
    }, 2000);
}