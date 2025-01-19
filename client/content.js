console.log("Focusaurus content script loaded.");

const blueSquare = document.createElement('div');
blueSquare.style.width = '100px';
blueSquare.style.height = '100px';
blueSquare.style.backgroundColor = 'blue';
blueSquare.style.position = 'fixed';
blueSquare.style.bottom = '0';
blueSquare.style.right = '0';
document.body.appendChild(blueSquare);