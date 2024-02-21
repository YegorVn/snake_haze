(() => {
  const canvas = document.getElementById("canvas");
  const c = canvas.getContext("2d");
  const observer = new ResizeObserver((entries) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });
  observer.observe(canvas);

  let snakeLength = 200;
  let currentSnakeLength = 0;
  let residualSnakeLength = 100;

  let x = 0;
  let y = 200;
  // TP - turn position
  let dir = "right";
  let prevDir = ["right"];
  let currTpX = 100;
  let currTpY = 200;
  let tpX = [100];
  let tpY = [200];
  let turns = 0;
  //

  const drawPath = () => {
    c.reset();
    c.beginPath();

    const drawResidualSnake = (i) => {
      if (i > 0) {
        switch (prevDir[i]) {
          case "right":
            {
              switch (prevDir[i - 1]) {
                case "down":
                  if (tpY[i] - tpY[i - 1] < snakeLength - currentSnakeLength) {
                    c.moveTo(tpX[i], tpY[i]);
                    c.lineTo(tpX[i], tpY[i - 1]);
                    drawResidualSnake(i - 1);
                  } else {
                    c.moveTo(tpX[i], tpY[i]);
                    c.lineTo(tpX[i], tpY[i] - snakeLength + currentSnakeLength);
                  }
                  break;
              }
            }
            break;
          case "down":
            {
              switch (prevDir[i - 1]) {
                case "right":
                  if (tpX[i] - tpX[i - 1] < snakeLength - currentSnakeLength) {
                    c.moveTo(tpX[i], tpY[i]);
                    c.lineTo(tpX[i - 1], tpY[i]);
                    drawResidualSnake(i - 1);
                  } else {
                    c.moveTo(tpX[i], tpY[i]);
                    c.lineTo(tpX[i] - snakeLength + currentSnakeLength, tpY[i]);
                  }
                  break;
              }
            }
            break;
        }
      }
    };

    // drawResidualSnake(turns);
    switch (dir) {
      case "left":
        c.moveTo(x, tpY);
        c.lineTo(x - snakeLength, tpY);
        break;
      case "up":
        if (currentSnakeLength < snakeLength) {
          c.moveTo(currTpX, currTpY);
          c.lineTo(currTpX, currTpY - currentSnakeLength);
          y = currTpY;
        } else {
          c.moveTo(currTpX, y);
          c.lineTo(currTpX, y - currentSnakeLength);
        }
        break;
      case "right":
        if (currentSnakeLength < snakeLength) {
          c.moveTo(currTpX, currTpY);
          c.lineTo(currTpX + currentSnakeLength, currTpY);
          x = currTpX;
        } else {
          c.moveTo(x, currTpY);
          c.lineTo(x + snakeLength, currTpY);
        }
        break;
      case "down":
        if (currentSnakeLength < snakeLength) {
          c.moveTo(currTpX, currTpY);
          c.lineTo(currTpX, currTpY + currentSnakeLength);
          y = currTpY;
        } else {
          c.moveTo(currTpX, y);
          c.lineTo(currTpX, y + currentSnakeLength);
        }

        break;
    }
    c.lineWidth = 3;
    c.stroke();
    c.closePath();
    c.clip();
  };

  const changeDir = (key) => {
    turns = turns + 1;
    switch (dir) {
      case "left":
        switch (key) {
          case "ArrowUp":
            tpX = x + snakeLength;
            dir = "up";
            break;
          case "ArrowDown":
            tpX = x + snakeLength;
            dir = "down";
            break;
        }
        prevDir.push("left");
        break;
      case "down":
        switch (key) {
          case "ArrowLeft":
            dir = "left";
            break;
          case "ArrowRight":
            dir = "right";
            break;
        }
        currTpX = x + snakeLength;
        currTpY = y + snakeLength;
        tpX.push(x + snakeLength);
        tpY.push(y + snakeLength);
        prevDir.push("down");
        break;
      case "right":
        switch (key) {
          case "ArrowUp":
            dir = "up";
            break;
          case "ArrowDown":
            dir = "down";
            break;
        }
        currTpX = x + currentSnakeLength;
        y = snakeLength - currTpY;
        tpX.push(x + snakeLength);
        tpY.push(y + snakeLength);
        prevDir.push("right");
        break;
      case "up":
        switch (key) {
          case "ArrowLeft":
            tpY = y + snakeLength;
            dir = "left";
            break;
          case "ArrowRight":
            tpY = y + snakeLength;
            dir = "right";
            break;
        }
        prevDir.push("up");
        break;
    }
    currentSnakeLength = 0;
  };

  document.addEventListener("keyup", (e) => {
    changeDir(e.key);
  });

  const updateFrames = () => {
    switch (dir) {
      case "up":
        y -= 2;
        break;
      case "down":
        y += 2;
        break;
      case "left":
        x -= 2;
        break;
      case "right":
        x += 2;
        break;
    }
    currentSnakeLength += 2;
    if (currentSnakeLength >= snakeLength) {
      turns = 0;
      currentSnakeLength = snakeLength;
    }
  };

  function loop() {
    drawPath();
    updateFrames();
    requestAnimationFrame(loop);
  }

  loop();
})();
