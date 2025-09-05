import React, { useState } from 'react';
import GameSelector from '@/components/GameSelector';
import QuizGame from '@/components/QuizGame';
import SortListGame from '@/components/games/SortListGame';
import GuessGame from '@/components/games/GuessGame';
import GroupRelationGame from '@/components/games/GroupRelationGame';
import MultipleChoiceGame from '@/components/games/MultipleChoiceGame';
import ColumnMatchGame from '@/components/games/ColumnMatchGame';
import MemoryGame from '@/components/games/MemoryGame';

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'yesno':
        return <QuizGame />;
      case 'sortlist':
        return <SortListGame onBack={handleBackToMenu} />;
      case 'guess':
        return <GuessGame onBack={handleBackToMenu} />;
      case 'groups':
        return <GroupRelationGame onBack={handleBackToMenu} />;
      case 'multiplechoice':
        return <MultipleChoiceGame onBack={handleBackToMenu} />;
      case 'columnmatch':
        return <ColumnMatchGame onBack={handleBackToMenu} />;
      case 'memory':
        return <MemoryGame onBack={handleBackToMenu} />;
      default:
        return <GameSelector onGameSelect={handleGameSelect} />;
    }
  };

  return renderGame();
};

export default Index;
