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

const guessesQty = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // Pegar uma categoria aleatória
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    // Pegar uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word, category}
  }, [words])
  
  // Iniciar o secret word
  const startGame = useCallback(() => {
    clearLetterStates()

    // Pegar letra e categoria
    const {word, category} = pickWordAndCategory()

    // Criar um array de letras
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((letter) => letter.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    // Setar os estados
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // Processar o input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
        return;
      }

      if(letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter,
        ])
      } else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ])

        setGuesses((actualGuesses) => actualGuesses - 1)
      }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length && letters.length > 0) {
      setScore((actualScore) => actualScore + 100)
      startGame()
    }

    console.log(uniqueLetters)
  }, [guessedLetters, letters, startGame])

  // Iniciar jogo novamente
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  const endGame = () => {
    clearLetterStates()
    setGameStage(stages[2].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
        verifyLetter={verifyLetter}  
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        endGame={endGame}
        />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
