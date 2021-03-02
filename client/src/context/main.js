import { createContext, useContext, useState } from "react";

const MainContext = createContext();

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainContextProvider = ({ children }) => {
  const [choiceInstrument, setChoiceInstrument] = useState("pen");
  const [color, setColor] = useState("#ffffff");
  const [canvasBgColor, setCanvasBgColor] = useState("#2e2e2e");
  const [lineWidth, setLineWidth] = useState(4);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [isOpenPopUp, setOpenPopUp] = useState(null);
  const [nickName, setNickName] = useState("");
  const [codeName, setCodeName] = useState("");
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  const [callRedo, setCallRedo] = useState(false);
  const [callUndo, setCallUndo] = useState(false);

  const [redo, setRedo] = useState([]);
  const [undo, setUndo] = useState([]);

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
        redo,
        setRedo,
        undo,
        setUndo,
        callRedo,
        callUndo,
        setCallRedo,
        setCallUndo,
        room,
        setRoom,
        isOpenPopUp,
        setOpenPopUp,
        codeName,
        setCodeName,
        error,
        setError,
        nickName,
        setNickName,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
