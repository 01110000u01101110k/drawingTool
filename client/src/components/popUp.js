import { useMainContext } from "../context/main.js";
import { AiOutlineClose } from "react-icons/ai";

const PopUp = () => {
  const {
    error,
    setError,
    codeName,
    setCodeName,
    setRoom,
    isOpenPopUp,
    setOpenPopUp,
    nickName,
    setNickName,
  } = useMainContext();
  function handleSubmit(event) {
    event.preventDefault();
    if (codeName && codeName.trim() && nickName && nickName.trim()) {
      setRoom(codeName.trim());
      if (error) {
        setError(null);
      }
    } else {
      setError("Одна из форм не заполнена.");
    }
  }
  function closePopUp() {
    setOpenPopUp(false);
  }
  function changeInputs(event) {
    if (event.target.id === "codeName") {
      setCodeName(event.target.value.trim());
    } else if (event.target.id === "nickName") {
      setNickName(event.target.value.trim());
    }
  }
  function generateCodeName() {
    const randomNum = Math.random().toString(36).substring(5);
    setCodeName(randomNum);
  }
  return (
    <div className="popUp">
      <div className="headPopUp">
        <button className="btnSquare" onClick={closePopUp}>
          <AiOutlineClose />
        </button>
      </div>
      <div className="bodyPopUp">
        <h2>
          {isOpenPopUp === "create room"
            ? "Создать комнату"
            : isOpenPopUp === "connected to room"
            ? "Подключиться к комнате"
            : null}
        </h2>
        <p>
          {isOpenPopUp === "create room"
            ? "Что-бы создать комнату придумайте секретный ключ для комнаты, или нажмите кнопку: 'Сгенерировать ключ комнаты'. Также укажите ваш никнейм. Ключ используется для совместного подключения к комнате нескольких человек с разных устройств. Как только все учасники покинут комнату, она будет удалена вместе со всеми данными."
            : isOpenPopUp === "connected to room"
            ? "Введите ключ комнаты, для подключения к нужной комнате. Также укажите никнейм, или введите ваше имя."
            : null}
        </p>
        <div className="popUpFormWrap">
          <form onSubmit={handleSubmit}>
            <div className="popUpInputsWrap">
              <input
                type="text"
                value={nickName}
                maxLength="25"
                id="nickName"
                placeholder="Ваш никнейм"
                className="input"
                onChange={changeInputs}
              />
              <input
                type="text"
                value={codeName}
                maxLength="8"
                id="codeName"
                placeholder="Ключ для комнаты"
                className="input"
                onChange={changeInputs}
              />
            </div>
            <div className="popUpBtnsWrap">
              <button type="submit" className="btnSquare">
                {isOpenPopUp === "create room"
                  ? "Создать комнату"
                  : "Подключиться к комнате"}
              </button>
              {isOpenPopUp === "create room" ? (
                <button
                  type="button"
                  className="btnSquare"
                  onClick={generateCodeName}
                >
                  Сгенерировать ключ комнаты
                </button>
              ) : null}
            </div>
          </form>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  );
};

export default PopUp;
