const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result');

const options = ['WINNER', 'SPIN AGAIN', 'BETTER LUCK NEXT TIME'];
const colors = ['#4A235A', '#512E5F', '#5B2C6F'];

const numSegments = options.length;
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
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px "Libre Baskerville", serif';
        ctx.fillText(options[i], canvas.width / 2 - 10, 10);
        ctx.restore();
    }
}

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
            resultText.textContent = `You got: ${options[numSegments - 1 - winningIndex]}`;
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


