import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, List, CheckCircle, XCircle } from 'lucide-react';

interface SortListGameProps {
  onBack: () => void;
}

const CONFIG = {
  question: "Ordena los planetas del sistema solar desde el más cercano al Sol:",
  shuffledList: ["Júpiter", "Mercurio", "Tierra", "Venus", "Marte"],
  correctOrder: ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter"],
  successMessage: "¡Excelente! Has ordenado correctamente los planetas.",
  errorMessage: "El orden no es correcto. ¡Inténtalo de nuevo!"
};

const SortListGame: React.FC<SortListGameProps> = ({ onBack }) => {
  const [items, setItems] = useState<string[]>([...CONFIG.shuffledList]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'error'>('playing');
  const [attempts, setAttempts] = useState<number>(0);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (gameStatus !== 'playing') return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, index) => item === CONFIG.correctOrder[index]);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setGameStatus('success');
    } else {
      setGameStatus('error');
      setTimeout(() => {
        setGameStatus('playing');
      }, 2000);
    }
  };

  const resetGame = () => {
    setItems([...CONFIG.shuffledList]);
    setGameStatus('playing');
    setAttempts(0);
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
                <List className="w-6 h-6" />
                Ordenar Lista
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                Intentos: {attempts}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Game Card */}
        <Card className="shadow-xl border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-dark">
              {CONFIG.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sortable List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item}
                  className="bg-white border-2 border-primary/20 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-dark text-lg">{item}</span>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <Button
                          onClick={() => moveItem(index, index - 1)}
                          disabled={gameStatus !== 'playing'}
                          size="sm"
                          variant="outline"
                        >
                          ↑
                        </Button>
                      )}
                      {index < items.length - 1 && (
                        <Button
                          onClick={() => moveItem(index, index + 1)}
                          disabled={gameStatus !== 'playing'}
                          size="sm"
                          variant="outline"
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {gameStatus === 'playing' && (
                <Button
                  onClick={checkOrder}
                  size="lg"
                  className="font-bold text-lg px-8"
                >
                  Verificar Orden
                </Button>
              )}
              <Button
                onClick={resetGame}
                variant="outline"
                size="lg"
                className="font-bold text-lg"
              >
                Reiniciar
              </Button>
            </div>

            {/* Status Messages */}
            {gameStatus === 'success' && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-success font-bold text-lg">{CONFIG.successMessage}</p>
                <p className="text-success text-sm mt-1">¡Completado en {attempts} intentos!</p>
              </div>
            )}

            {gameStatus === 'error' && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center">
                <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
                <p className="text-error font-bold text-lg">{CONFIG.errorMessage}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Instrucciones:</p>
              <ul className="space-y-1">
                <li>• Usa los botones ↑ y ↓ para mover los elementos</li>
                <li>• Ordena de acuerdo a la pregunta</li>
                <li>• Presiona "Verificar Orden" cuando termines</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortListGame;