flappyBird();

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
  let isRunning = true;

  // Bird Functions
  function updateBird() {
    document.addEventListener("click", function (event) {
      birdVelocity = -flapStrength;
    });
    birdVelocity += gravity;
    birdY += birdVelocity;

    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
  }

  // Pipe Functions
  function spawnPipes() {
    let height = Math.floor(Math.random() * 250);
    pipePair = {
      topPipe: {
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: height,
      },
      bottomPipe: {
        x: canvas.width,
        y: height + pipeDistance,
        width: pipeWidth,
        height: canvas.height - height - pipeDistance,
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
      ctx.fillRect(
        pipePair.topPipe.x,
        pipePair.topPipe.y,
        pipePair.topPipe.width,
        pipePair.topPipe.height
      );
      ctx.fillRect(
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
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText(score, 15, 35);
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
        birdY <= pipes[0].topPipe.height ||
        birdY + birdHeight >= pipes[0].bottomPipe.y
      ) {
        isRunning = false;
      }
    }
  }

  function runGame() {
    if (isRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateBird();
      updatePipes();
      updateScore();
      hasCollided();
    }
  }

  setInterval(runGame, 1000 / 60);
  setInterval(spawnPipes, pipeSpawnInterval);
}
