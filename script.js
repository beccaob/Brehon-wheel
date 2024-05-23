document.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        startGame();
    }
});

function startGame() {
    const startPage = document.getElementById('startPage');
    const gamePage = document.getElementById('gamePage');

    // Hide start page
    startPage.style.display = 'none';

    // Show game page
    gamePage.style.display = 'block';

    // Start the wheel
    drawWheel();
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result');

// Define the wheel options and colors
const options = ['WINNER', 'SPIN AGAIN', 'NEXT TIME'];
const colors = ['#4A235A', '#512E5F', '#5B2C6F'];

// Number of repetitions for each option
const repetitions = 5; // Repeat each option 5 times

// Create an array with repeated options and corresponding colors
let wheelOptions = [];
let wheelColors = [];

for (let i = 0; i < options.length; i++) {
    for (let j = 0; j < repetitions; j++) {
        wheelOptions.push(options[i]);
        wheelColors.push(colors[i]);
    }
}

// Function to shuffle the arrays without consecutive duplicates
function shuffleNoConsecutiveDuplicates(array) {
    let shuffled;
    do {
        shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    } while (shuffled.some((val, i) => i > 0 && val === shuffled[i - 1]));
    return shuffled;
}

// Shuffle the options and colors
wheelOptions = shuffleNoConsecutiveDuplicates(wheelOptions);
wheelColors = shuffleNoConsecutiveDuplicates(wheelColors);

const numSegments = wheelOptions.length;
const segmentAngle = 2 * Math.PI / numSegments;

let isSpinning = false;
let startAngle = 0;
let spinTimeout;

function drawWheel() {
    // Adjust canvas size
    canvas.width = 2000; // Adjust as needed
    canvas.height = 2000; // Adjust as needed

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adjust wheel radius
    const wheelRadius = Math.min(canvas.width, canvas.height) * 0.4;

    for (let i = 0; i < numSegments; i++) {
        const angle = startAngle + i * segmentAngle;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, wheelRadius, angle, angle + segmentAngle);
        ctx.fillStyle = wheelColors[i % wheelColors.length];
        ctx.fill();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 50px "Libre Baskerville", serif';
        ctx.fillText(wheelOptions[i], wheelRadius - 10, 10);
        ctx.restore();
    }

    // Draw the red selector at the top
    const winningIndex = Math.floor((startAngle / segmentAngle) % numSegments);
    const selectorAngle = startAngle + (numSegments - winningIndex - 0.5) * segmentAngle;
    const selectorLength = wheelRadius * 0.8; // Adjust the length of the selector
    const selectorX = canvas.width / 2 + Math.cos(selectorAngle) * selectorLength;
    const selectorY = canvas.height / 2 + Math.sin(selectorAngle) * selectorLength;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(selectorX, selectorY);
    ctx.lineTo(selectorX - 10, selectorY - 20); // Adjust the size and direction of the selector
    ctx.lineTo(selectorX + 10, selectorY - 20); // Adjust the size and direction of the selector
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}

// Rest of the code remains the same


function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    const spinAngle = Math.random() * 10 + 10;
    const spinTime = 3000; // Spin time in milliseconds

    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / spinTime, 1);
        const easeOutProgress = Math.pow(progress, 2);

        startAngle += easeOutProgress * spinAngle;

        drawWheel();

        if (progress < 1) {
            spinTimeout = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(spinTimeout);
            isSpinning = false;
            const winningIndex = Math.floor((startAngle / segmentAngle) % numSegments);
            resultText.textContent = ``;
        }
    }

    spinTimeout = requestAnimationFrame(animate);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        spinWheel();
    }
});

drawWheel();


