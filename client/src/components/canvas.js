import { useRef, useEffect, useState } from "react";
import { useMainContext } from "../context/main.js";
import PopUp from "./popUp.js";

function Canvas() {
  const {
    choiceInstrument,
    color,
    canvasBgColor,
    lineWidth,
    clearCanvas,
    callRedo,
    setCallRedo,
    callUndo,
    setCallUndo,
    redo,
    setRedo,
    undo,
    setUndo,
    isOpenPopUp,
    room,
    nickName,
  } = useMainContext();
  const canvasRef = useRef();
  let mouseFixedDown = false;

  const [canvas, setCanvas] = useState();
  const [context, setContext] = useState();
  const [resize, setResize] = useState([]);

  const [canvasActionSwitched, setCanvasActionSwitched] = useState(null);
  let socket = new WebSocket("ws://localhost:5000");

  useEffect(() => {
    setCanvas(() => canvasRef.current);
    setContext(() => canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (room) {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            method: "connection",
            id: room,
            nickName: nickName,
          })
        );
      };
      socket.onmessage = (event) => {
        let message = JSON.parse(event.data);
        if (message.method === "connection") {
          console.log("client WebSocket", message.nickName);
        } else if ("message") {
          /*const image = document.createElement("img");
          image.src = message;
          context.clearRect(0, 0, canvas.width, canvas.height);
          image.onload = () => {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          };*/
          console.log(message.message);
        }
      };
    }
  }, [room]);

  function testWebSockets() {
    socket.send(
      JSON.stringify({
        method: "message",
        id: room,
        nickName: nickName,
        message: canvas.toDataURL("image/png", 1),
      })
    );
  }

  useEffect(() => {
    if (canvas) {
      if (window.innerWidth !== resize[0] || window.innerHeight !== resize[1]) {
        const handleResize = () => {
          const saveCanvas = canvas.toDataURL("image/png", 1);

          canvas.width = window.innerWidth * 0.9;
          canvas.height = window.innerHeight * 0.8;

          const image = document.createElement("img");
          image.src = saveCanvas;
          context.clearRect(0, 0, canvas.width, canvas.height);
          image.onload = () => {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          };
        };

        window.addEventListener("resize", handleResize);
        setResize(window.innerWidth, window.innerHeight);
      }
    }
  }, [canvas, resize]);

  useEffect(() => {
    if (context) {
      let startPositionX;
      let startPositionY;
      let endPositionX;
      let endPositionY;
      let saveCanvas;

      /* //тени
      context.shadowColor = "black";
      context.shadowBlur = 15;
      context.shadowOffsetX = 4;
      context.shadowOffsetY = 4;
      */

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
                Math.sqrt(width ** 1.9 + height ** 1.9),
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
          saveCanvas = canvas.toDataURL("image/png", 1);
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

  useEffect(() => {
    if (callRedo) {
      setCallRedo(false);
      if (redo.length > 0) {
        const image = document.createElement("img");
        const lastRedo = redo[redo.length - 1];
        image.src = lastRedo;
        setUndo((undo) => [...undo, canvas.toDataURL("image/png", 1)]);
        setRedo((redo) => redo.filter((item) => item !== lastRedo));
        image.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [callRedo]);

  useEffect(() => {
    if (callUndo) {
      setCallUndo(false);
      if (undo.length > 0) {
        const image = document.createElement("img");
        const lastUndo = undo[undo.length - 1];
        image.src = lastUndo;
        setRedo((redo) => [...redo, canvas.toDataURL("image/png", 1)]);
        setUndo((undo) => undo.filter((item) => item !== lastUndo));
        image.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [callUndo]);

  function newUndoData() {
    setUndo((undo) => [...undo, canvas.toDataURL("image/png", 1)]);
  }

  const [clearPopUp, setClearPopUp] = useState(false);

  useEffect(() => {
    if (isOpenPopUp === false) {
      setTimeout(() => {
        setClearPopUp(true);
      }, 500);
    } else if (isOpenPopUp) {
      setClearPopUp(false);
    }
  }, [isOpenPopUp]);

  return (
    <main className="canvasWrap">
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: canvasBgColor }}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.8}
        onMouseDown={newUndoData}
        className="canvas"
      >
        Ваш браузер не поддерживает canvas (холст), откройте сайт в более новом
        браузере.
      </canvas>
      <button
        className="btnSquare btnSquareActive"
        onClick={testWebSockets}
      ></button>
      {isOpenPopUp ? (
        <div className="popUpAnimationOpen">
          <PopUp />
        </div>
      ) : isOpenPopUp === false ? (
        <div className="popUpAnimationClose">
          {clearPopUp ? null : <PopUp />}
        </div>
      ) : null}
    </main>
  );
}

export default Canvas;
