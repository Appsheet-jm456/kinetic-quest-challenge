import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckSquare, CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceGameProps {
  onBack: () => void;
}

const CONFIG = {
  question: "¿Cuál es el planeta más grande del sistema solar?",
  options: [
    { id: 'a', text: 'Tierra', isCorrect: false },
    { id: 'b', text: 'Júpiter', isCorrect: true },
    { id: 'c', text: 'Saturno', isCorrect: false },
    { id: 'd', text: 'Neptuno', isCorrect: false }
  ],
  successMessage: "¡Correcto! Júpiter es efectivamente el planeta más grande de nuestro sistema solar.",
  errorMessage: "Respuesta incorrecta. ¡Inténtalo de nuevo!",
  explanation: "Júpiter tiene un diámetro de aproximadamente 142,984 km, más de 11 veces el diámetro de la Tierra."
};

const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({ onBack }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'error'>('playing');
  const [attempts, setAttempts] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleOptionSelect = (optionId: string) => {
    if (gameStatus !== 'playing') return;
    setSelectedOption(optionId);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    
    const selected = CONFIG.options.find(opt => opt.id === selectedOption);
    setAttempts(attempts + 1);
    
    if (selected?.isCorrect) {
      setGameStatus('success');
      setShowExplanation(true);
    } else {
      setGameStatus('error');
      setTimeout(() => {
        setGameStatus('playing');
        setSelectedOption(null);
      }, 2000);
    }
  };

  const resetGame = () => {
    setSelectedOption(null);
    setGameStatus('playing');
    setAttempts(0);
    setShowExplanation(false);
  };

  const getOptionStyle = (option: any) => {
    if (gameStatus === 'playing') {
      return selectedOption === option.id
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-gray-300 hover:border-primary/50 hover:bg-primary/5';
    }
    
    if (gameStatus === 'success') {
      if (option.isCorrect) {
        return 'border-success bg-success/10 text-success';
      }
      return selectedOption === option.id
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-gray-300 text-gray-500';
    }
    
    if (gameStatus === 'error') {
      if (selectedOption === option.id) {
        return 'border-error bg-error/10 text-error';
      }
      if (option.isCorrect) {
        return 'border-success bg-success/10 text-success';
      }
      return 'border-gray-300 text-gray-500';
    }
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
                <CheckSquare className="w-6 h-6" />
                Opción Múltiple
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
            {/* Options */}
            <div className="space-y-3">
              {CONFIG.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${getOptionStyle(option)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedOption === option.id ? 'bg-current' : ''
                      }`} />
                    </div>
                    <span className="font-medium text-lg">
                      {option.id.toUpperCase()}. {option.text}
                    </span>
                    {gameStatus !== 'playing' && option.isCorrect && (
                      <CheckCircle className="w-5 h-5 text-success ml-auto" />
                    )}
                    {gameStatus === 'error' && selectedOption === option.id && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-error ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {gameStatus === 'playing' && (
                <Button
                  onClick={checkAnswer}
                  size="lg"
                  className="font-bold text-lg px-8"
                  disabled={!selectedOption}
                >
                  Verificar Respuesta
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
                <p className="text-success text-sm mt-1">¡Correcto en {attempts} intentos!</p>
              </div>
            )}

            {gameStatus === 'error' && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center">
                <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
                <p className="text-error font-bold text-lg">{CONFIG.errorMessage}</p>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-secondary/20 rounded-lg p-4">
                <p className="font-semibold text-dark mb-2">Explicación:</p>
                <p className="text-muted-foreground">{CONFIG.explanation}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Instrucciones:</p>
              <ul className="space-y-1">
                <li>• Lee cuidadosamente la pregunta</li>
                <li>• Selecciona la opción que consideres correcta</li>
                <li>• Presiona "Verificar Respuesta" para comprobar</li>
                <li>• Solo hay una respuesta correcta</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultipleChoiceGame;