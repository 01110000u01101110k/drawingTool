import Nav from "./components/nav";
import Canvas from "./components/canvas";
import { MainContextProvider } from "./context/main.js";

function App() {
  return (
    <div className="App">
      <MainContextProvider>
        <Nav />
        <Canvas />
      </MainContextProvider>
    </div>
  );
}

export default App;
