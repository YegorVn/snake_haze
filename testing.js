(() => {
  const canvas = document.getElementById("canvas");
  const c = canvas.getContext("2d");
  const observer = new ResizeObserver((entries) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });
  observer.observe(canvas);

  let len = 275;
  let completedLen = 270;
  let taleLen = null;

  let x = 200;
  let y = 300;
  let dir = "right";
  //
  const controls = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];

  let stack = [];

  const drawPath = () => {
    c.reset();
    c.beginPath();
    switch (dir) {
      case "left":
        c.moveTo(x, y);
        c.lineTo(x - completedLen, y);
        if (x < completedLen && x > 0) {
          c.moveTo(canvas.width, y);
          c.lineTo(canvas.width - (len - x), y);
        }
        break;
      case "up":
        c.moveTo(x, y);
        c.lineTo(x, y - completedLen);
        if (y < completedLen && y > 0) {
          c.moveTo(x, canvas.height);
          c.lineTo(x, canvas.height - (len - y));
        }
        break;
      case "right":
        c.moveTo(x, y);
        c.lineTo(x + completedLen, y);
        if (x > canvas.width - completedLen && x < canvas.width) {
          c.moveTo(0, y);
          c.lineTo(len - (canvas.width - x), y);
        } else if (x > canvas.width) {
          x = 0;
        }
        break;
      case "down":
        c.moveTo(x, y);
        c.lineTo(x, y + completedLen);
        if (y > canvas.height - completedLen && y < canvas.height) {
          c.moveTo(x, 0);
          c.lineTo(x, len - (canvas.height - y));
        }
        break;
    }

    stack.forEach((path, index) => {
      const { dir, startPosX, startPosY, turnPosX, turnPosY, risidualLen } = {
        ...path,
      };
      if (index === 0) {
        const startPoint = risidualLen - taleLen;
        switch (dir) {
          case "up":
            c.moveTo(startPosX, startPosY - startPoint);
            c.lineTo(turnPosX, turnPosY);
            break;
          case "right":
            c.moveTo(startPosX + startPoint, startPosY);
            c.lineTo(turnPosX, turnPosY);
            break;
          case "left":
            c.moveTo(startPosX - startPoint, startPosY);
            c.lineTo(turnPosX, turnPosY);
            break;
          case "down":
            c.moveTo(startPosX, startPosY + startPoint);
            c.lineTo(turnPosX, turnPosY);
            break;
        }
      } else {
        c.moveTo(startPosX, startPosY);
        c.lineTo(turnPosX, turnPosY);
      }
    });

    c.lineWidth = 4;
    c.stroke();
    c.closePath();
    c.clip();
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

  const updateFrames = () => {
    if (taleLen !== null) {
      taleLen -= 2;
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

    if (completedLen < len) {
      completedLen += 2;
    } else {
      completedLen = len;
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
