//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//Data
import { wordsList } from './data/words';

//Components
import StartScreen from './components/Start/StartScreen';
import Game from './components/Game/Game';
import GameOver from './components/Game/Over/GameOver';

const stages = [
  {id: 1, name:"start"},
  {id: 2, name:"game"},
  {id: 3, name:"end"},
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  
  // Iniciar o secret word
  const startGame = () => {
    setGameStage(stages[1].name)
  }

  // Processar o input
  const verifyLetter = () => {
    setGameStage(stages[2].name)
  }

  // Iniciar jogo novamente
  const retry = () => {
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter}/>}
      {gameStage === 'end' && <GameOver retry={retry}/>}
    </div>
  );
}

export default App;
