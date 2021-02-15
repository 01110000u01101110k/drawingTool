import { useMainContext } from "../context/main.js";
import { BsBrush } from "react-icons/bs";
import { BsPlusSquareFill } from "react-icons/bs";
import { BsFillSquareFill } from "react-icons/bs";
import { BsFillCircleFill } from "react-icons/bs";
import { BsSlash } from "react-icons/bs";

import { FaEraser } from "react-icons/fa";

function Nav() {
  const {
    choiceInstrument,
    setChoiceInstrument,
    color,
    setColor,
    canvasBgColor,
    setCanvasBgColor,
    lineWidth,
    setLineWidth,
    setClearCanvas,
    clearCanvas,
  } = useMainContext();

  return (
    <nav>
      <button
        className={
          choiceInstrument === "pen" ? "btnSquare btnSquareActive" : "btnSquare"
        }
        onClick={() => setChoiceInstrument("pen")}
      >
        <BsBrush />
      </button>
      <button
        className={
          choiceInstrument === "line"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setChoiceInstrument("line")}
      >
        <BsSlash />
      </button>
      <button
        className={
          choiceInstrument === "square"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setChoiceInstrument("square")}
      >
        <BsFillSquareFill />
      </button>
      <button
        className={
          choiceInstrument === "circle"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setChoiceInstrument("circle")}
      >
        <BsFillCircleFill />
      </button>
      <button
        className={
          choiceInstrument === "eraser"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setChoiceInstrument("eraser")}
      >
        <FaEraser />
      </button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="colorInput"
      />
      <input
        type="color"
        value={canvasBgColor}
        onChange={(e) => setCanvasBgColor(e.target.value)}
        className="colorInput"
      />
      <input
        type="range"
        value={lineWidth}
        onChange={(e) => setLineWidth(e.target.value)}
      />
      <input
        type="number"
        value={lineWidth}
        onChange={(e) => setLineWidth(e.target.value)}
        className="lineWidthNumberInput"
        max="200"
      />
      <button
        className={
          choiceInstrument === "addImg"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setChoiceInstrument("addImg")}
      >
        <BsPlusSquareFill />
      </button>
      <button
        className={
          choiceInstrument === "clear"
            ? "btnSquare btnSquareActive"
            : "btnSquare"
        }
        onClick={() => setClearCanvas(!clearCanvas)}
      >
        Очистить холст
      </button>
    </nav>
  );
}

export default Nav;
