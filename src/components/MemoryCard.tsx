
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

const MemoryCard = ({
  id,
  image,
  isFlipped,
  isMatched,
  onClick,
  disabled
}: MemoryCardProps) => {
  const [showFlipAnimation, setShowFlipAnimation] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      setShowFlipAnimation(true);
    }
  }, [isFlipped]);

  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer w-full h-full perspective-1000",
        disabled && !isFlipped && !isMatched ? "cursor-default" : "",
        isMatched ? "pointer-events-none" : ""
      )}
      onClick={handleClick}
    >
      <div 
        className={cn(
          "w-full h-full transition-transform duration-500 transform-style-3d",
          showFlipAnimation && (isFlipped ? "rotate-y-180" : "rotate-y-0"),
          isMatched ? "opacity-60" : ""
        )}
      >
        {/* Card Back */}
        <div 
          className={cn(
            "absolute w-full h-full backface-hidden bg-game-primary rounded-xl flex items-center justify-center",
            "shadow-lg border-2 border-game-light",
            showFlipAnimation && isFlipped ? "hidden" : "block"
          )}
        >
          <div className="text-3xl font-bold text-white">?</div>
        </div>
        
        {/* Card Front */}
        <div 
          className={cn(
            "absolute w-full h-full backface-hidden bg-white rounded-xl flex items-center justify-center rotate-y-180",
            "shadow-lg border-2", 
            isMatched ? "border-green-400" : "border-game-light",
            showFlipAnimation && isFlipped ? "block" : "hidden"
          )}
        >
          <div className="w-3/4 h-3/4 flex items-center justify-center">
            <img 
              src={image} 
              alt="Memory Card" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
