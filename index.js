class BallGame {
  constructor(numBalls) {
    this.balls = [];
    this.container = document.querySelector(".container");
    this.numBalls = numBalls;
  }

  randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createRandomBall() {
    const x = this.randomize(0, this.container.offsetWidth);
    const y = this.randomize(0, this.container.offsetHeight);
    const dx = this.randomize(-2, 2);
    const dy = this.randomize(-2, 2);
    const radius = this.randomize(10, 20);
    const size = 2 * radius;
    return {
      x,
      y,
      dx,
      dy,
      radius,
      size,
    };
  }

  drawBall(ball) {
    const ballElement = document.createElement("div");
    ballElement.classList.add("ball");
    ballElement.style.left = ball.x + "px";
    ballElement.style.top = ball.y + "px";
    ballElement.style.width = ball.size + "px";
    ballElement.style.height = ball.size + "px";
    this.container.appendChild(ballElement);
  }

  moveBall(ball) {
    this.container.removeChild(document.querySelector(".ball"));
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Adjusting ball position if it reaches the container boundaries
    if (ball.x + ball.size >= this.container.offsetWidth) {
      ball.x = this.container.offsetWidth - ball.size;
      ball.dx *= -1;
    } else if (ball.x < 0) {
      ball.x = 0;
      ball.dx *= -1;
    }

    if (ball.y + ball.size >= this.container.offsetHeight) {
      ball.y = this.container.offsetHeight - ball.size;
      ball.dy *= -1;
    } else if (ball.y < 0) {
      ball.y = 0;
      ball.dy *= -1;
    }

    this.drawBall(ball);
    this.detectCollision(ball);
  }

  detectCollision(ball) {
    for (let i = 0; i < this.balls.length; i++) {
      const anotherBall = this.balls[i];
      if (ball !== anotherBall) {
        const dx = ball.x - anotherBall.x;
        const dy = ball.y - anotherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ball.radius + anotherBall.radius) {
          //collision occurs
          this.resolveCollision(ball, anotherBall);
        }
      }
    }
  }
  resolveCollision(ballA, ballB) {
    const dx = ballA.x - ballB.x;
    const dy = ballA.y - ballB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radiiSum = ballA.radius + ballB.radius;

    //separating the overlapped balls
    const separationDistanceX = (dx / distance) * radiiSum;
    const separationDistanceY = (dy / distance) * radiiSum;

    ballA.x = ballB.x + separationDistanceX;
    ballA.y = ballB.y + separationDistanceY;

    //swapping the velocities of overlapped balls
    let tempX = ballA.dx;
    let tempY = ballA.dy;
    ballA.dx = ballB.dx;
    ballA.dy = ballB.dy;
    ballB.dx = tempX;
    ballB.dy = tempY;
  }

  init() {
    for (let i = 0; i < this.numBalls; i++) {
      const ball = this.createRandomBall();
      this.balls.push(ball);
    }

    this.balls.forEach((ball) => this.drawBall(ball));
    setInterval(() => {
      this.balls.forEach((ball) => this.moveBall(ball));
    }, timing);
  }
}

const numBalls = 15;
const timing = 2;
const ballGame = new BallGame(numBalls);
ballGame.init();
