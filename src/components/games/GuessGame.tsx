import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

interface GuessGameProps {
  onBack: () => void;
}

const CONFIG = {
  clue: "Soy el órgano más importante del cuerpo humano, controlo todas las funciones y estoy protegido por el cráneo. ¿Qué soy?",
  correctAnswer: "cerebro",
  extraClue: "Sin mí no podrías pensar, recordar ni controlar tus movimientos.",
  successMessage: "¡Correcto! El cerebro es efectivamente el órgano que controla todo nuestro cuerpo.",
  errorMessage: "Respuesta incorrecta. ¡Sigue intentando!",
  imageUrl: "" // Optional
};

const GuessGame: React.FC<GuessGameProps> = ({ onBack }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'error'>('playing');
  const [showExtraClue, setShowExtraClue] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrect = CONFIG.correctAnswer.toLowerCase().trim();
    
    setAttempts(attempts + 1);
    
    if (normalizedAnswer === normalizedCorrect) {
      setGameStatus('success');
    } else {
      setGameStatus('error');
      setTimeout(() => {
        setGameStatus('playing');
      }, 2000);
    }
  };

  const resetGame = () => {
    setUserAnswer('');
    setGameStatus('playing');
    setShowExtraClue(false);
    setAttempts(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim() && gameStatus === 'playing') {
      checkAnswer();
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
                <Lightbulb className="w-6 h-6" />
                Adivinanza
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
              ¡Resuelve la Adivinanza!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Clue */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-primary mt-1" />
                <p className="text-dark font-medium text-lg leading-relaxed">
                  {CONFIG.clue}
                </p>
              </div>
            </div>

            {/* Extra Clue */}
            {showExtraClue && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-accent mt-1" />
                  <p className="text-dark font-medium">
                    <strong>Pista extra:</strong> {CONFIG.extraClue}
                  </p>
                </div>
              </div>
            )}

            {/* Extra Clue Button */}
            {!showExtraClue && gameStatus === 'playing' && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowExtraClue(true)}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Mostrar Pista Extra
                </Button>
              </div>
            )}

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Tu respuesta:
                </label>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  disabled={gameStatus !== 'playing'}
                  className="text-lg py-3"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                {gameStatus === 'playing' && (
                  <Button
                    type="submit"
                    size="lg"
                    className="font-bold text-lg px-8"
                    disabled={!userAnswer.trim()}
                  >
                    Verificar Respuesta
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={resetGame}
                  variant="outline"
                  size="lg"
                  className="font-bold text-lg"
                >
                  Reiniciar
                </Button>
              </div>
            </form>

            {/* Status Messages */}
            {gameStatus === 'success' && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-success font-bold text-lg">{CONFIG.successMessage}</p>
                <p className="text-success text-sm mt-1">¡Resuelto en {attempts} intentos!</p>
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
                <li>• Lee cuidadosamente la pista</li>
                <li>• Puedes solicitar una pista extra si la necesitas</li>
                <li>• Escribe tu respuesta y presiona "Verificar"</li>
                <li>• ¡Sigue intentando hasta encontrar la respuesta correcta!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuessGame;