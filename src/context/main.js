import { createContext, useContext, useState } from "react";

const MainContext = createContext();

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainContextProvider = ({ children }) => {
  const [choiceInstrument, setChoiceInstrument] = useState("pen");
  const [color, setColor] = useState("#ffffff");
  const [canvasBgColor, setCanvasBgColor] = useState("#3f3f3f");
  const [lineWidth, setLineWidth] = useState(4);
  const [clearCanvas, setClearCanvas] = useState(false);

  return (
    <MainContext.Provider
      value={{
        choiceInstrument,
        setChoiceInstrument,
        color,
        setColor,
        canvasBgColor,
        setCanvasBgColor,
        lineWidth,
        setLineWidth,
        clearCanvas,
        setClearCanvas,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
