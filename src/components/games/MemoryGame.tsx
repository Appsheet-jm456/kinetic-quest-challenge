import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, CheckCircle, RotateCcw, Clock } from 'lucide-react';

interface MemoryGameProps {
  onBack: () => void;
}

const CONFIG = {
  pairs: [
    { id: 1, content: '🐶', name: 'Perro' },
    { id: 2, content: '🐱', name: 'Gato' },
    { id: 3, content: '🐭', name: 'Ratón' },
    { id: 4, content: '🐯', name: 'Tigre' },
    { id: 5, content: '🦁', name: 'León' },
    { id: 6, content: '🐸', name: 'Rana' }
  ]
};

interface CardType {
  id: string;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      setMoves(moves + 1);
      
      if (firstCard?.pairId === secondCard?.pairId) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setMatchedPairs(matchedPairs + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, cards, moves, matchedPairs]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === CONFIG.pairs.length && gameStatus === 'playing') {
      setGameStatus('finished');
      setEndTime(Date.now());
    }
  }, [matchedPairs, gameStatus]);

  const initializeGame = () => {
    // Create pairs of cards
    const gameCards: CardType[] = [];
    
    CONFIG.pairs.forEach(pair => {
      // Add two cards for each pair
      gameCards.push({
        id: `${pair.id}-1`,
        pairId: pair.id,
        content: pair.content,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${pair.id}-2`,
        pairId: pair.id,
        content: pair.content,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStatus('playing');
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handleCardClick = (cardId: string) => {
    if (gameStatus !== 'playing') return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card?.isMatched) return;
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    setFlippedCards(prev => [...prev, cardId]);
  };

  const getGameTime = () => {
    if (endTime) {
      return Math.floor((endTime - startTime) / 1000);
    }
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const getCardStyle = (card: CardType) => {
    if (card.isMatched) {
      return 'border-success bg-success/10';
    }
    if (card.isFlipped) {
      return 'border-primary bg-primary/10';
    }
    return 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Memory
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {getGameTime()}s
                </Badge>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Movimientos: {moves}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Game Stats */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Parejas Encontradas</p>
                <p className="text-2xl font-bold text-primary">{matchedPairs}/{CONFIG.pairs.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Progreso</p>
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(matchedPairs / CONFIG.pairs.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card className="shadow-xl border-2 border-primary/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square border-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-4xl hover:scale-105 ${getCardStyle(card)}`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span className="select-none">{card.content}</span>
                  ) : (
                    <div className="w-full h-full bg-secondary/20 rounded-md flex items-center justify-center">
                      <span className="text-secondary text-2xl">?</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={initializeGame}
            variant="outline"
            size="lg"
            className="font-bold text-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nuevo Juego
          </Button>
        </div>

        {/* Victory Message */}
        {gameStatus === 'finished' && (
          <Card className="shadow-xl border-2 border-success/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-dark mb-2">¡Felicitaciones!</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Has completado el juego de memory
                </p>
                
                <div className="bg-secondary/20 rounded-lg p-6 max-w-sm mx-auto">
                  <h4 className="font-semibold mb-4 text-dark">Estadísticas Finales:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tiempo total:</span>
                      <span className="font-medium">{Math.floor((endTime! - startTime) / 1000)} segundos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movimientos:</span>
                      <span className="font-medium">{moves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parejas:</span>
                      <span className="font-medium">{CONFIG.pairs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eficiencia:</span>
                      <span className="font-medium">
                        {Math.round((CONFIG.pairs.length / moves) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Instrucciones:</p>
          <ul className="space-y-1">
            <li>• Haz clic en las cartas para voltearlas</li>
            <li>• Encuentra las parejas de cartas iguales</li>
            <li>• Solo puedes voltear 2 cartas a la vez</li>
            <li>• ¡Completa todas las parejas en el menor tiempo y movimientos posibles!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;