
import GameBoard from '@/components/GameBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-game-light py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-game-primary mb-2">Memory Match</h1>
          <p className="text-lg text-gray-600">Flip cards and find matching pairs</p>
        </header>
        
        <GameBoard />
      </div>
    </div>
  );
};

export default Index;
