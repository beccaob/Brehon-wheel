const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result');

// Define the wheel options and colors
const options = ['WINNER', 'SPIN AGAIN', 'BETTER LUCK NEXT TIME'];
const colors = ['#4A235A', '#512E5F', '#5B2C6F'];

// Number of repetitions for each option
const repetitions = 5; // Repeat each option 5 times

// Create an array with repeated options and corresponding colors
const wheelOptions = [];
const wheelColors = [];

for (let i = 0; i < options.length; i++) {
    for (let j = 0; j < repetitions; j++) {
        wheelOptions.push(options[i]);
        wheelColors.push(colors[i]);
    }
}

const numSegments = wheelOptions.length;
const segmentAngle = 2 * Math.PI / numSegments;

let isSpinning = false;
let startAngle = 0;
let spinTimeout;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        const angle = startAngle + i * segmentAngle;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + segmentAngle);
        ctx.fillStyle = wheelColors[i % wheelColors.length];
        ctx.fill();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px "Libre Baskerville", serif';
        ctx.fillText(wheelOptions[i], canvas.width / 2 - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    const spinAngle = Math.random() * 10 + 10;
    const spinTime = 3000; // Spin time in 


