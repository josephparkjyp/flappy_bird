const bird = new Image();
bird.src = "bird.png";
const pipeTop = new Image();
pipeTop.src = "pipeTop.png";
const pipeBot = new Image();
pipeBot.src = "pipeBot.png";
const background = new Image();
background.src = "background.jpg";
const play_button = document.getElementById("play");
play_button.addEventListener("click", play);

function play() {
  play_button.style.display = "none";
  flappyBird();
}

function flappyBird() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Bird Variables:
  let birdX = 25;
  let birdY = canvas.height / 2;
  let birdWidth = 25;
  let birdHeight = 25;
  let birdVelocity = 0;
  let flapStrength = 5;
  let gravity = 0.25;

  // Pipe Variables:
  let pipes = [];
  let pipeWidth = 75;
  let pipePair = {};
  let pipeDistance = 100;
  let pipeVelocity = 2.5;
  let pipeSpawnInterval = 1500;

  // Game Variables:
  let score = 0;
  let highScore = 0;
  let isRunning = true;

  // Bird Functions
  function updateBird() {
    document.addEventListener("click", function (event) {
      birdVelocity = -flapStrength;
    });
    birdVelocity += gravity;
    birdY += birdVelocity;

    ctx.save(); // Save the current canvas state
    ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2); // Translate to the center of the bird
    ctx.rotate((birdVelocity * Math.PI) / 90); // Rotate by 65 degrees (converted to radians)
    ctx.drawImage(bird, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight); // Draw the bird centered at (0,0)
    ctx.restore();
  }

  // Pipe Functions
  function spawnPipes() {
    let height = Math.floor(Math.random() * 250);
    pipePair = {
      topPipe: {
        x: canvas.width,
        y: -height,
        width: pipeWidth,
        height: 300,
      },
      bottomPipe: {
        x: canvas.width,
        y: -height + 300 + pipeDistance,
        width: pipeWidth,
        height: 300,
      },
    };
    pipes.push(pipePair);
  }

  function updatePipes() {
    let pipesToRemove = [];

    pipes.forEach((pipePair, index) => {
      if (pipePair.topPipe.x + pipePair.topPipe.width <= 0) {
        pipesToRemove.push(index);
        score += 1;
      } else {
        pipePair.topPipe.x -= pipeVelocity;
        pipePair.bottomPipe.x -= pipeVelocity;
      }

      ctx.fillStyle = "green";
      ctx.drawImage(
        pipeTop,
        pipePair.topPipe.x,
        pipePair.topPipe.y,
        pipePair.topPipe.width,
        pipePair.topPipe.height
      );
      ctx.drawImage(
        pipeBot,
        pipePair.bottomPipe.x,
        pipePair.bottomPipe.y,
        pipePair.bottomPipe.width,
        pipePair.bottomPipe.height
      );
    });

    pipesToRemove.forEach((index) => {
      pipes.splice(index, 1);
    });
  }

  // Game Functions

  function updateScore() {
    if (score >= highScore) {
      highScore = score;
    }
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.fillText(`Score: ${score}`, 15, 35);
    ctx.fillText(`High Score: ${highScore}`, 115, 35);
  }

  function hasCollided() {
    if (
      birdY < 0 ||
      birdY > canvas.height - birdHeight ||
      (birdX <= pipes[0].topPipe.x &&
        birdX + birdWidth >= pipes[0].topPipe.x) ||
      (birdX >= pipes[0].topPipe.x &&
        birdX + birdWidth <= pipes[0].topPipe.x + pipes[0].topPipe.width) ||
      (birdX <= pipes[0].topPipe.x + pipes[0].topPipe.width &&
        birdX + birdWidth >= pipes[0].topPipe.x + pipes[0].topPipe.width)
    ) {
      if (
        birdY <= pipes[0].topPipe.y + 300 ||
        birdY + birdHeight >= pipes[0].bottomPipe.y
      ) {
        isRunning = false;
        restart_button.style.display = "block";
      }
    }
  }

  function restart() {
    restart_button.style.display = "none";

    birdX = 25;
    birdY = canvas.height / 2;
    birdWidth = 25;
    birdHeight = 25;
    birdVelocity = 0;
    flapStrength = 5;
    gravity = 0.25;

    // Pipe Variables:
    pipes = [];
    pipeWidth = 75;
    pipePair = {};
    pipeDistance = 100;
    pipeVelocity = 2.5;
    pipeSpawnInterval = 1500;

    // Game Variables:
    score = 0;
    isRunning = true;
  }

  function runGame() {
    if (isRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      updateBird();
      updatePipes();
      updateScore();
      hasCollided();
    }
  }

  setInterval(runGame, 1000 / 60);
  setInterval(spawnPipes, pipeSpawnInterval);

  const restart_button = document.getElementById("restart");
  restart_button.addEventListener("click", restart);
}
