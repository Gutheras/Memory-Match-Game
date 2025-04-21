
import { useState, useEffect } from 'react';
import MemoryCard from './MemoryCard';
import { cn } from '@/lib/utils';

// Card images (using SVG data URLs for simplicity)
const cardImages = [
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAyLjUgOC44NjYgNS44OCAyMS4wOCAxOC4xMiAyMS4wOCAyMS41IDguODY2Ii8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjIiIHJ5PSIyIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik01IDRoNGwtMiA1IDIgNUg1bC0yLTUgMi01Wm0xMCAwaDRsMiA1LTIgNWgtNGwyLTUtMi01WiIvPjwvc3ZnPg==",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0zIDZoMThtLTE4IDZoMThtLTE4IDZoMTgiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Im0zIDggMTggOG0wLTggLTE4IDgiLz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAydjIwbTUtMTAgMTAgMG0tMjAgMCAxMCAwIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI4N2Y1IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Im0yIDEyIDVoMTVtMC04LTV2MTNtMCAwdi01aC01Ii8+PC9zdmc+",
];

// Types
interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GameBoard = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameOver]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  // Handle card flips
  useEffect(() => {
    if (flippedCards.length === 2) {
      setDisabled(true);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard?.image === secondCard?.image) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore(prevScore => prevScore + 10);
        setFlippedCards([]);
        setDisabled(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setDisabled(false);
        }, 1000);
      }
      
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedCards, cards]);

  // Initialize game
  const initializeGame = () => {
    // Duplicate each card to create pairs
    const cardPairs = [...cardImages, ...cardImages]
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle cards
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTimer(0);
    setGameOver(false);
    setGameStarted(false);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (flippedCards.length < 2) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
      
      setFlippedCards(prevFlipped => [...prevFlipped, id]);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <div className="flex gap-4">
          <div className="bg-game-light text-game-tertiary font-semibold px-4 py-2 rounded-lg shadow">
            Moves: {moves}
          </div>
          <div className="bg-game-light text-game-tertiary font-semibold px-4 py-2 rounded-lg shadow">
            Score: {score}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-game-light text-game-tertiary font-semibold px-4 py-2 rounded-lg shadow">
            Time: {formatTime(timer)}
          </div>
          <button 
            onClick={initializeGame}
            className="bg-game-accent text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className={cn(
        "grid gap-4 w-full aspect-square mx-auto",
        "grid-cols-4"
      )}>
        {cards.map(card => (
          <div key={card.id} className="aspect-square">
            <MemoryCard
              id={card.id}
              image={card.image}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-game-primary mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">You completed the game!</p>
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Moves</p>
                <p className="text-2xl font-bold text-game-tertiary">{moves}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-game-tertiary">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-2xl font-bold text-game-tertiary">{formatTime(timer)}</p>
              </div>
            </div>
            <button 
              onClick={initializeGame}
              className="bg-game-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-game-secondary transition-colors w-full"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
