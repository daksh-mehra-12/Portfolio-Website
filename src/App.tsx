import "./App.css";
import MainContainer from "./components/MainContainer";
import CharacterModel from "./components/Character";
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <LoadingProvider>
      <MainContainer>
        <CharacterModel />
      </MainContainer>
    </LoadingProvider>
  );
};

export default App;
