import { useRef, useEffect, useState } from "react";
import { useMainContext } from "../context/main.js";

function Canvas() {
  const {
    choiceInstrument,
    color,
    canvasBgColor,
    lineWidth,
    clearCanvas,
  } = useMainContext();
  const canvasRef = useRef();
  let mouseFixedDown = false;

  const [canvas, setCanvas] = useState();
  const [context, setContext] = useState();

  const [canvasActionSwitched, setCanvasActionSwitched] = useState(null);

  useEffect(() => {
    setCanvas(() => canvasRef.current);
    setContext(() => canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (context) {
      let startPositionX;
      let startPositionY;
      let endPositionX;
      let endPositionY;
      let saveCanvas;

      const draw = () => {
        if (choiceInstrument === "pen" || choiceInstrument === "eraser") {
          context.lineTo(endPositionX, endPositionY);
          context.stroke();
        } else if (
          choiceInstrument === "square" ||
          choiceInstrument === "circle" ||
          choiceInstrument === "line"
        ) {
          const width = endPositionX - startPositionX;
          const height = endPositionY - startPositionY;

          const image = document.createElement("img");
          image.src = saveCanvas;
          image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            context.beginPath();

            if (choiceInstrument === "square") {
              context.rect(startPositionX, startPositionY, width, height);
            } else if (choiceInstrument === "circle") {
              context.arc(
                startPositionX,
                startPositionY,
                Math.sqrt(width ** 2 + height ** 2),
                0,
                2 * Math.PI
              );
            } else if (choiceInstrument === "line") {
              context.moveTo(startPositionX, startPositionY);
              context.lineTo(endPositionX, endPositionY);
            }

            context.fillStyle = color;
            context.fill();
            context.stroke();
          };
        }
      };

      const mouseDown = (e) => {
        context.lineWidth = lineWidth;

        if (choiceInstrument === "eraser") {
          context.globalCompositeOperation = "destination-out";
          context.strokeStyle = "rgba(255,255,255,255)";
        } else {
          context.globalCompositeOperation = "source-over";
          context.strokeStyle = color;
        }

        context.beginPath();
        startPositionX = e.pageX - e.target.offsetLeft;
        startPositionY = e.pageY - e.target.offsetTop;

        if (
          choiceInstrument === "pen" ||
          choiceInstrument === "eraser" ||
          choiceInstrument === "line"
        ) {
          context.moveTo(startPositionX, startPositionY);
        }
        if (
          choiceInstrument === "square" ||
          choiceInstrument === "circle" ||
          choiceInstrument === "line"
        ) {
          saveCanvas = canvas.toDataURL();
        }
        mouseFixedDown = true;
      };
      const mouseUp = () => {
        mouseFixedDown = false;
      };
      const mouseMove = (e) => {
        if (mouseFixedDown) {
          endPositionX = e.pageX - e.target.offsetLeft;
          endPositionY = e.pageY - e.target.offsetTop;
          draw();
        }
      };
      const addListeners = () => {
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        canvas.onmouseout = mouseUp;
        canvas.onmousemove = mouseMove;
      };
      const deleteListeners = () => {
        canvas.onmousemove = null;
        canvas.onmousedown = null;
        canvas.onmouseout = null;
        canvas.onmouseup = null;
      };

      if (!canvasActionSwitched) {
        addListeners();
        setCanvasActionSwitched(choiceInstrument);
      } else if (canvasActionSwitched) {
        deleteListeners();
        setCanvasActionSwitched(choiceInstrument);
        addListeners();
      }
    }
  }, [choiceInstrument, color, lineWidth, context]);

  useEffect(() => {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [clearCanvas]);

  return (
    <main className="canvasWrap">
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: canvasBgColor }}
        width={1400}
        height={600}
        className="canvas"
      >
        Ваш браузер не поддерживает холст, откройте сайт в более новом браузере.
      </canvas>
    </main>
  );
}

export default Canvas;
