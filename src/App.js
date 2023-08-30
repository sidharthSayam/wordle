import { useEffect, useState } from "react";
import "./styles.css";
import words from "./words";

export default function App() {
  const [result, setResult] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [numberOfGuesses, setNumberOfGuesses] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const handleKeys = function (event) {
    if (gameOver) return;
    if (event.key === "Enter") {
      if (currentGuess.length !== 5) {
        return;
      }

      if (currentGuess === result.toLowerCase()) {
        setGameOver(true);
        return;
      }
      let newGuesses = [...guesses];
      newGuesses[newGuesses.findIndex((val) => val === null)] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuess("");
      setNumberOfGuesses((prev) => prev + 1);
      return;
    }
    if (event.key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
      return;
    }
    if (currentGuess.length >= 5) return;
    if (currentGuess.length < 5 && event.keyCode >= 65 && event.keyCode <= 90)
      setCurrentGuess(currentGuess + event.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeys);

    return () => window.removeEventListener("keydown", handleKeys);
  }, [currentGuess, gameOver, result, guesses]);

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setResult(randomWord.toLowerCase());
  }, []);

  const onChange = (input) => {};

  const onKeyPress = (button) => {
    handleKeys(button);
  };

  if (!gameOver) {
    if (numberOfGuesses === 6) {
      return (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
            height: "100vh",
          }}
        >
          {" "}
          You've lost the game. Answer is{" "}
          <span style={{ color: "green", textDecoration: "underline" }}>
            {result.toUpperCase()}
          </span>
        </h1>
      );
    }
    return (
      <div className="App">
        <h1 className="title"> Wordle</h1>
        {guesses.map((guess, idx) => {
          let isCurrentGuess = idx === guesses.findIndex((val) => val === null);
          return (
            <Line
              key={idx}
              guess={isCurrentGuess ? currentGuess : guess ?? " "}
              isFinal={!isCurrentGuess && guess != null}
              result={result}
            />
          );
        })}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          className="instructions"
        >
          {" "}
          Instructions{" "}
        </a>
      </div>
    );
  }

  if (gameOver) {
    return (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
          height: "100vh",
        }}
      >
        {" "}
        You've won the game. Correct word was
        <span style={{ color: "green", textDecoration: "underline" }}>
          {result.toUpperCase()}
        </span>
      </h1>
    );
  }
}

function Line({ guess, isFinal, result }) {
  const length = 5;
  const box = [];
  let className;
  for (let i = 0; i < length; i++) {
    className = "tile";
    if (isFinal) {
      if (guess[i] === result[i]) {
        className += " correct";
      } else if (result.includes(guess[i])) {
        className += " wrong-position";
      } else {
        className += " wrong";
      }
    }

    box.push(
      <div key={i} className={className}>
        {" "}
        {guess[i]}{" "}
      </div>
    );
  }

  return <div className="tile-box">{box}</div>;
}
