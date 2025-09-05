import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CheckCircle, RotateCcw } from 'lucide-react';

interface GroupRelationGameProps {
  onBack: () => void;
}

const CONFIG = {
  categories: [
    { id: 'mammals', name: 'Mamíferos', color: 'bg-primary' },
    { id: 'birds', name: 'Aves', color: 'bg-secondary' },
    { id: 'fish', name: 'Peces', color: 'bg-accent' }
  ],
  elements: [
    { id: 'dog', name: 'Perro', category: 'mammals' },
    { id: 'eagle', name: 'Águila', category: 'birds' },
    { id: 'shark', name: 'Tiburón', category: 'fish' },
    { id: 'cat', name: 'Gato', category: 'mammals' },
    { id: 'parrot', name: 'Loro', category: 'birds' },
    { id: 'tuna', name: 'Atún', category: 'fish' },
    { id: 'elephant', name: 'Elefante', category: 'mammals' },
    { id: 'penguin', name: 'Pingüino', category: 'birds' }
  ]
};

interface ElementPlacement {
  elementId: string;
  categoryId: string | null;
}

const GroupRelationGame: React.FC<GroupRelationGameProps> = ({ onBack }) => {
  const [placements, setPlacements] = useState<ElementPlacement[]>(
    CONFIG.elements.map(el => ({ elementId: el.id, categoryId: null }))
  );
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState<number>(0);

  const moveElement = (elementId: string, categoryId: string | null) => {
    if (gameStatus !== 'playing') return;
    
    setPlacements(prev => 
      prev.map(p => 
        p.elementId === elementId 
          ? { ...p, categoryId } 
          : p
      )
    );
  };

  const checkAnswers = () => {
    let correctCount = 0;
    
    placements.forEach(placement => {
      const element = CONFIG.elements.find(el => el.id === placement.elementId);
      if (element && element.category === placement.categoryId) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setGameStatus('finished');
  };

  const resetGame = () => {
    setPlacements(CONFIG.elements.map(el => ({ elementId: el.id, categoryId: null })));
    setGameStatus('playing');
    setScore(0);
  };

  const getElementsInCategory = (categoryId: string | null) => {
    return placements
      .filter(p => p.categoryId === categoryId)
      .map(p => CONFIG.elements.find(el => el.id === p.elementId))
      .filter(Boolean);
  };

  const unplacedElements = getElementsInCategory(null);

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
                <Users className="w-6 h-6" />
                Relacionar Grupos
              </CardTitle>
              {gameStatus === 'finished' && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Puntuación: {score}/{CONFIG.elements.length}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Instructions */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-lg font-medium text-dark">
              Arrastra cada animal a su categoría correcta
            </p>
          </CardContent>
        </Card>

        {/* Unplaced Elements */}
        {unplacedElements.length > 0 && (
          <Card className="shadow-lg border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-dark">Elementos por clasificar:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {unplacedElements.map(element => (
                  <div
                    key={element?.id}
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm cursor-move hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-dark">{element?.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONFIG.categories.map(category => {
            const elementsInCategory = getElementsInCategory(category.id);
            return (
              <Card key={category.id} className="shadow-lg border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className={`text-center text-white rounded-lg py-2 ${category.color}`}>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[200px] space-y-3">
                  {elementsInCategory.map(element => (
                    <div
                      key={element?.id}
                      className="bg-white border-2 border-primary/20 rounded-lg p-3 shadow-sm flex justify-between items-center"
                    >
                      <span className="font-medium text-dark">{element?.name}</span>
                      {gameStatus === 'playing' && (
                        <Button
                          onClick={() => moveElement(element?.id || '', null)}
                          size="sm"
                          variant="outline"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {/* Drop Zone */}
                  {gameStatus === 'playing' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-gray-500 text-sm">Arrastra elementos aquí</p>
                      <div className="mt-2 space-y-1">
                        {unplacedElements.map(element => (
                          <Button
                            key={element?.id}
                            onClick={() => moveElement(element?.id || '', category.id)}
                            variant="ghost"
                            size="sm"
                            className="block w-full text-left"
                          >
                            + {element?.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {gameStatus === 'playing' && (
            <Button
              onClick={checkAnswers}
              size="lg"
              className="font-bold text-lg px-8"
              disabled={unplacedElements.length > 0}
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
                  Has clasificado correctamente {score} de {CONFIG.elements.length} elementos
                </p>
                
                {/* Score breakdown */}
                <div className="bg-secondary/20 rounded-lg p-4 max-w-md mx-auto">
                  <p className="font-semibold mb-2">Resultados por categoría:</p>
                  {CONFIG.categories.map(category => {
                    const elementsInCategory = getElementsInCategory(category.id);
                    const correctElements = elementsInCategory.filter(el => 
                      CONFIG.elements.find(configEl => configEl.id === el?.id)?.category === category.id
                    );
                    return (
                      <div key={category.id} className="flex justify-between text-sm">
                        <span>{category.name}:</span>
                        <span>{correctElements.length}/{elementsInCategory.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupRelationGame;