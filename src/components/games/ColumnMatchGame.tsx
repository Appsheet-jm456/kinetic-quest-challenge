import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowLeftRight, CheckCircle, RotateCcw } from 'lucide-react';

interface ColumnMatchGameProps {
  onBack: () => void;
}

const CONFIG = {
  title: "Relaciona cada país con su capital",
  leftColumn: [
    { id: 'spain', text: 'España' },
    { id: 'france', text: 'Francia' },
    { id: 'italy', text: 'Italia' },
    { id: 'germany', text: 'Alemania' },
    { id: 'portugal', text: 'Portugal' }
  ],
  rightColumn: [
    { id: 'madrid', text: 'Madrid' },
    { id: 'paris', text: 'París' },
    { id: 'rome', text: 'Roma' },
    { id: 'berlin', text: 'Berlín' },
    { id: 'lisbon', text: 'Lisboa' }
  ],
  correctMatches: [
    { left: 'spain', right: 'madrid' },
    { left: 'france', right: 'paris' },
    { left: 'italy', right: 'rome' },
    { left: 'germany', right: 'berlin' },
    { left: 'portugal', right: 'lisbon' }
  ]
};

interface Match {
  leftId: string;
  rightId: string;
}

const ColumnMatchGame: React.FC<ColumnMatchGameProps> = ({ onBack }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState<number>(0);

  const handleLeftSelect = (id: string) => {
    if (gameStatus !== 'playing') return;
    
    setSelectedLeft(selectedLeft === id ? null : id);
    setSelectedRight(null);
  };

  const handleRightSelect = (id: string) => {
    if (gameStatus !== 'playing') return;
    
    if (selectedLeft) {
      // Create or update match
      const newMatches = matches.filter(m => m.leftId !== selectedLeft && m.rightId !== id);
      newMatches.push({ leftId: selectedLeft, rightId: id });
      setMatches(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight(selectedRight === id ? null : id);
    }
  };

  const removeMatch = (leftId: string) => {
    setMatches(matches.filter(m => m.leftId !== leftId));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    
    matches.forEach(match => {
      const isCorrect = CONFIG.correctMatches.some(
        correct => correct.left === match.leftId && correct.right === match.rightId
      );
      if (isCorrect) correctCount++;
    });
    
    setScore(correctCount);
    setGameStatus('finished');
  };

  const resetGame = () => {
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setGameStatus('playing');
    setScore(0);
  };

  const getMatchForLeft = (leftId: string) => {
    return matches.find(m => m.leftId === leftId);
  };

  const getMatchForRight = (rightId: string) => {
    return matches.find(m => m.rightId === rightId);
  };

  const isRightMatched = (rightId: string) => {
    return matches.some(m => m.rightId === rightId);
  };

  const getItemStyle = (isSelected: boolean, isMatched: boolean, isCorrectMatch?: boolean) => {
    if (gameStatus === 'finished' && isCorrectMatch !== undefined) {
      return isCorrectMatch
        ? 'border-success bg-success/10 text-success'
        : 'border-error bg-error/10 text-error';
    }
    
    if (isSelected) {
      return 'border-primary bg-primary/10 text-primary';
    }
    
    if (isMatched) {
      return 'border-secondary bg-secondary/10 text-secondary';
    }
    
    return 'border-gray-300 hover:border-primary/50 hover:bg-primary/5';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
                <ArrowLeftRight className="w-6 h-6" />
                Relacionar Columnas
              </CardTitle>
              {gameStatus === 'finished' && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Puntuación: {score}/{CONFIG.correctMatches.length}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Instructions */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-lg font-medium text-dark">
              {CONFIG.title}
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {gameStatus === 'playing' 
                ? 'Selecciona un elemento de la izquierda, luego su pareja de la derecha'
                : 'Verde = Correcto, Rojo = Incorrecto'
              }
            </p>
          </CardContent>
        </Card>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-lg font-bold text-dark">
                Países
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONFIG.leftColumn.map(item => {
                const match = getMatchForLeft(item.id);
                const isSelected = selectedLeft === item.id;
                const isMatched = !!match;
                
                let isCorrectMatch;
                if (gameStatus === 'finished' && match) {
                  isCorrectMatch = CONFIG.correctMatches.some(
                    correct => correct.left === item.id && correct.right === match.rightId
                  );
                }
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleLeftSelect(item.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${getItemStyle(isSelected, isMatched, isCorrectMatch)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{item.text}</span>
                      {match && (
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="w-4 h-4" />
                          <span className="text-sm">
                            {CONFIG.rightColumn.find(r => r.id === match.rightId)?.text}
                          </span>
                          {gameStatus === 'playing' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatch(item.id);
                              }}
                              size="sm"
                              variant="ghost"
                              className="ml-2"
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Right Column */}
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-lg font-bold text-dark">
                Capitales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONFIG.rightColumn.map(item => {
                const match = getMatchForRight(item.id);
                const isSelected = selectedRight === item.id;
                const isMatched = isRightMatched(item.id);
                
                let isCorrectMatch;
                if (gameStatus === 'finished' && match) {
                  isCorrectMatch = CONFIG.correctMatches.some(
                    correct => correct.left === match.leftId && correct.right === item.id
                  );
                }
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleRightSelect(item.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${getItemStyle(isSelected, isMatched, isCorrectMatch)}`}
                  >
                    <span className="font-medium text-lg">{item.text}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {gameStatus === 'playing' && (
            <Button
              onClick={checkAnswers}
              size="lg"
              className="font-bold text-lg px-8"
              disabled={matches.length !== CONFIG.correctMatches.length}
            >
              Verificar Respuestas
            </Button>
          )}
          <Button
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="font-bold text-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Results */}
        {gameStatus === 'finished' && (
          <Card className="shadow-xl border-2 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-dark mb-2">¡Juego Completado!</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Has relacionado correctamente {score} de {CONFIG.correctMatches.length} parejas
                </p>
                
                <div className="bg-secondary/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="font-semibold mb-2">Resultados:</p>
                  <div className="space-y-1 text-sm">
                    {CONFIG.correctMatches.map(correct => {
                      const userMatch = matches.find(m => m.leftId === correct.left);
                      const isCorrect = userMatch?.rightId === correct.right;
                      const leftItem = CONFIG.leftColumn.find(l => l.id === correct.left);
                      const rightItem = CONFIG.rightColumn.find(r => r.id === correct.right);
                      
                      return (
                        <div key={correct.left} className={`flex justify-between ${isCorrect ? 'text-success' : 'text-error'}`}>
                          <span>{leftItem?.text}</span>
                          <span>→</span>
                          <span>{rightItem?.text}</span>
                          <span>{isCorrect ? '✓' : '✗'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ColumnMatchGame;