(() => {
  const canvas = document.getElementById("canvas");
  const c = canvas.getContext("2d");
  const observer = new ResizeObserver((entries) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });
  observer.observe(canvas);

  // sizes
  let len = 275;
  let thick = 10;
  let velocity = 3;
  // movement
  let x = 200;
  let y = 300;
  let taleLen = null;
  let completedLen = 270;
  let dir = "right";
  // feed
  let feedX = Math.random() * canvas.width;
  let feedY = Math.random() * canvas.height;
  const controls = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];

  let stack = [];

  const drawPath = () => {
    const drawEndCircle = (x, y) => {
      c.beginPath();
      c.arc(x, y, thick / 2, 0, 2 * Math.PI);
      c.fill();
      c.closePath();
    };

    const putFeed = () => {
      c.beginPath();
      c.arc(feedX, feedY, 6, 0, 2 * Math.PI);
      c.fill();
      c.closePath();
    };

    c.reset();
    putFeed();
    switch (dir) {
      case "left":
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - completedLen, y);
        if (x < completedLen && x > 0) {
          c.moveTo(canvas.width, y);
          c.lineTo(canvas.width - (len - x), y);
        }
        c.closePath();
        c.lineWidth = thick;
        c.stroke();
        drawEndCircle(x, y);
        drawEndCircle(x - completedLen, y);
        break;
      case "up":
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y - completedLen);
        if (y < completedLen && y > 0) {
          c.moveTo(x, canvas.height);
          c.lineTo(x, canvas.height - (len - y));
        }
        c.closePath();
        c.lineWidth = thick;
        c.stroke();
        drawEndCircle(x, y);
        drawEndCircle(x, y - completedLen);
        break;
      case "right":
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + completedLen, y);
        if (x > canvas.width - completedLen && x < canvas.width) {
          c.moveTo(0, y);
          c.lineTo(len - (canvas.width - x), y);
        }
        c.closePath();
        c.lineWidth = thick;
        c.stroke();
        drawEndCircle(x, y);
        drawEndCircle(x + completedLen, y);
        break;
      case "down":
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y + completedLen);
        if (y > canvas.height - completedLen && y < canvas.height) {
          c.moveTo(x, 0);
          c.lineTo(x, len - (canvas.height - y));
        }
        c.closePath();
        c.lineWidth = thick;
        c.stroke();
        drawEndCircle(x, y);
        drawEndCircle(x, y + completedLen);
        break;
    }

    stack.forEach((path, index) => {
      const { dir, startPosX, startPosY, turnPosX, turnPosY, risidualLen } = {
        ...path,
      };
      c.beginPath();
      c.arc(turnPosX, turnPosY, thick / 2, 0, 2 * Math.PI);
      c.fill();
      c.closePath();
      c.beginPath();
      if (index === 0) {
        const startPoint = risidualLen - taleLen;
        switch (dir) {
          case "up":
            c.beginPath();
            c.moveTo(startPosX, startPosY - startPoint);
            c.lineTo(turnPosX, turnPosY);
            c.closePath();
            c.lineWidth = thick;
            c.stroke();
            drawEndCircle(startPosX, startPosY - startPoint);
            break;
          case "right":
            c.beginPath();
            c.moveTo(startPosX + startPoint, startPosY);
            c.lineTo(turnPosX, turnPosY);
            c.closePath();
            c.lineWidth = thick;
            c.stroke();
            drawEndCircle(startPosX + startPoint, startPosY);
            break;
          case "left":
            c.beginPath();
            c.moveTo(startPosX - startPoint, startPosY);
            c.lineTo(turnPosX, turnPosY);
            c.closePath();
            c.lineWidth = thick;
            c.stroke();
            drawEndCircle(startPosX - startPoint, startPosY);
            break;
          case "down":
            c.beginPath();
            c.moveTo(startPosX, startPosY + startPoint);
            c.lineTo(turnPosX, turnPosY);
            c.closePath();
            c.lineWidth = thick;
            c.stroke();
            drawEndCircle(startPosX, startPosY + startPoint);
            break;
        }
      } else {
        c.beginPath();
        c.lineWidth = 1;
        c.moveTo(startPosX, startPosY);
        c.lineTo(turnPosX, turnPosY);
        c.closePath();
        c.lineWidth = thick;
        c.stroke();
      }
    });
  };

  const changeDir = (key) => {
    if (key !== dir && controls.includes(key)) {
      let path = {
        risidualLen: completedLen,
        startPosX: x,
        startPosY: y,
        turnPosX: x,
        turnPosY: y,
      };
      switch (dir) {
        case "up":
          switch (key) {
            case "ArrowLeft":
              dir = "left";

              break;
            case "ArrowRight":
              dir = "right";
              break;
          }
          path.dir = "up";
          path.turnPosY = y - completedLen;
          //
          y = y - completedLen;
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
          path.dir = "right";
          path.turnPosX = x + completedLen;
          //
          x = x + completedLen;
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
          path.dir = "down";
          path.turnPosY = y + completedLen;
          //
          y = y + completedLen;
          break;
        case "left":
          switch (key) {
            case "ArrowUp":
              dir = "up";
              break;
            case "ArrowDown":
              dir = "down";
              break;
          }
          path.dir = "left";
          path.turnPosX = x - completedLen;
          //
          x = x - completedLen;
          break;
        default:
          break;
      }
      if (stack.length === 0) {
        taleLen = completedLen;
      }

      stack.push(path);
      completedLen = 0;
    }
  };

  document.addEventListener("keyup", (e) => {
    changeDir(e.key);
  });

  const detectCross = () => {
    if (stack.length !== 0) {
      stack.forEach((path) => {});
    }
  };

  const checkInRange = (compVal, range, val) => {
    if (val <= compVal + range && val >= compVal - range) {
      return true;
    }
  };

  const updateFrames = () => {
    // feed
    // tale
    if (taleLen !== null) {
      taleLen -= velocity;
    }

    if (taleLen <= 0) {
      stack.shift();
      if (stack.length !== 0) {
        taleLen = stack[0].risidualLen;
      }
      if (stack.length === 0) {
        taleLen = null;
      }
    }
    detectCross();

    const putFeed = () => {
      if (
        (checkInRange(feedY, 20, y - completedLen) &&
          checkInRange(feedX, 20, x)) ||
        (checkInRange(feedY, 20, y + completedLen) &&
          checkInRange(feedX, 20, x)) ||
        (checkInRange(feedY, 20, y) &&
          checkInRange(feedX, 20, x - completedLen)) ||
        (checkInRange(feedY, 20, y) &&
          checkInRange(feedX, 20, x + completedLen))
      ) {
        feedX = Math.random() * canvas.width;
        feedY = Math.random() * canvas.height;
        len += 30;
      }
    };

    putFeed();

    // front&frames
    if (completedLen < len) {
      completedLen += velocity;
    } else {
      completedLen = len;
      switch (dir) {
        case "up":
          y -= velocity;
          break;
        case "down":
          y += velocity;
          break;
        case "left":
          x -= velocity;
          break;
        case "right":
          // if (
          //   checkInRange(feedY, 10, y) &&
          //   checkInRange(feedX, 10, x + completedLen)
          // ) {
          //   feedX = Math.random() * canvas.width;
          //   feedY = Math.random() * canvas.height;
          // }
          x += velocity;
          break;
      }
      if (x > canvas.width) x = 0;
      if (x < 0) x = canvas.width;
      if (y > canvas.height) y = 0;
      if (y < 0) y = canvas.height;
    }
  };

  function loop() {
    drawPath();
    updateFrames();
    requestAnimationFrame(loop);
  }

  loop();
})();
