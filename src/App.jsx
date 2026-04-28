import GameHeader from "./components/GameHeader";
import { Card } from "./components/Card";
import { useEffect, useState, useRef } from "react";
import { WinMessage } from "./components/WinMessage";

const cardValues = [
  "💐",
  "🦄",
  "🕊️",
  "🐰",
  "🍇",
  "🐦‍🔥",
  "🪸",
  "🐬",
  "🌵",
  "🏝️",
  "💐",
  "🦄",
  "🕊️",
  "🐰",
  "🍇",
  "🐦‍🔥",
  "🪸",
  "🐬",
  "🌵",
  "🏝️",
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLock, setIsLock] = useState(false);
  const matchSoundRef = useRef(null);
  const errorSoundRef = useRef(null);

  useEffect(() => {
    matchSoundRef.current = new Audio("/sounds/match.mp3");
    errorSoundRef.current = new Audio("/sounds/error.mp3");
  }, []);

  const suhffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    // Suffle the game

    const shuffled = suhffleArray(cardValues);

    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    setIsLock(false);
    setMoves(0);
    setScore(0);
    setMatchedCards([]);
    setFlippedCards([]);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const playSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  const handleCardClick = (card) => {
    // Don't allow the card clicking if card is already flipped
    if (
      card.isFlipped ||
      card.isMatched ||
      isLock ||
      flippedCards.length === 2
    ) {
      return;
    }

    // update the card flipped state
    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      } else {
        return c;
      }
    });

    setCards(newCards);

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    // check for match if two cards are flippped

    if (flippedCards.length === 1) {
      setIsLock(true);
      const firstCard = cards[flippedCards[0]];

      if (firstCard.value === card.value) {
        playSound(matchSoundRef);
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          setScore((prev) => prev + 1);
          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              } else {
                return c;
              }
            }),
          );
          setFlippedCards([]);
          setIsLock(false);
        }, 500);
      } else {
        // flip back card1, card2
        playSound(errorSoundRef);
        setTimeout(() => {
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });
          setCards(flippedBackCard);
          setIsLock(false);
          setFlippedCards([]);
        }, 500);
      }
      setMoves((prev) => prev + 1);
    }
  };

  const isGameComplete = matchedCards.length === cardValues.length;

  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={initializeGame} />

      {isGameComplete && <WinMessage moves={moves} />}

      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
