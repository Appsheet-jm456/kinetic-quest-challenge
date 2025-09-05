import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Trophy, Target, ArrowLeft } from 'lucide-react';

interface GameConfig {
  question: string;
  correctAnswer: 'yes' | 'no';
  hints: [string, string];
  messages: {
    success: string;
    error: string;
  };
}

const CONFIG: GameConfig = {
  question: "¿Es el agua esencial para la vida?",
  correctAnswer: 'yes',
  hints: [
    "Pista 1: Todos los seres vivos necesitan este líquido para sobrevivir",
    "Pista 2: Cubre aproximadamente el 71% de la superficie de la Tierra"
  ],
  messages: {
    success: "¡Excelente! Has respondido correctamente.",
    error: "Respuesta incorrecta. ¡Inténtalo de nuevo!"
  }
};

interface QuizGameProps {
  onBack?: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ onBack }) => {
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [answered, setAnswered] = useState<boolean>(false);

  const getScoreForAnswer = (hintsUsed: number): number => {
    if (hintsUsed === 0) return 100;
    if (hintsUsed === 1) return 50;
    if (hintsUsed === 2) return 25;
    return 0;
  };

  const showHint = () => {
    if (hintsUsed < 2) {
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (answered) return;

    const isCorrect = answer === CONFIG.correctAnswer;
    const score = isCorrect ? getScoreForAnswer(hintsUsed) : 0;
    
    setTotalScore(totalScore + score);
    setQuestionsAnswered(questionsAnswered + 1);
    setMaxPossibleScore(maxPossibleScore + 100);
    
    if (isCorrect) {
      setGameMessage(CONFIG.messages.success);
      setMessageType('success');
    } else {
      setGameMessage(CONFIG.messages.error);
      setMessageType('error');
    }
    
    setAnswered(true);
  };

  const resetGame = () => {
    setHintsUsed(0);
    setGameMessage('');
    setMessageType('');
    setAnswered(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header with Score */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              )}
              <div className="flex-1" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              Quiz Educativo
            </CardTitle>
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Puntuación: {totalScore}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Máximo: {maxPossibleScore}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="shadow-xl border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-dark">
              {CONFIG.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hints Section */}
            {hintsUsed > 0 && (
              <div className="space-y-3">
                {Array.from({ length: hintsUsed }, (_, i) => (
                  <div key={i} className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-dark font-medium">{CONFIG.hints[i]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hint Button */}
            {hintsUsed < 2 && !answered && (
              <div className="flex justify-center">
                <Button
                  onClick={showHint}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Mostrar Pista {hintsUsed + 1}
                </Button>
              </div>
            )}

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer('yes')}
                disabled={answered}
                size="lg"
                className="text-xl font-bold py-6 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                SÍ
              </Button>
              <Button
                onClick={() => handleAnswer('no')}
                disabled={answered}
                size="lg"
                variant="outline"
                className="text-xl font-bold py-6 border-2 border-dark text-dark hover:bg-dark hover:text-white disabled:opacity-50"
              >
                NO
              </Button>
            </div>

            {/* Message Display */}
            {gameMessage && (
              <div className={`text-center p-4 rounded-lg font-bold text-lg ${
                messageType === 'success' 
                  ? 'bg-success/10 text-success border border-success/30' 
                  : 'bg-error/10 text-error border border-error/30'
              }`}>
                {gameMessage}
                {answered && (
                  <div className="mt-2 text-sm">
                    Puntos obtenidos: {messageType === 'success' ? getScoreForAnswer(hintsUsed) : 0}
                  </div>
                )}
              </div>
            )}

            {/* Reset Button */}
            {answered && (
              <div className="flex justify-center">
                <Button
                  onClick={resetGame}
                  variant="secondary"
                  size="lg"
                  className="font-bold"
                >
                  Nueva Pregunta
                </Button>
              </div>
            )}

            {/* Scoring Info */}
            <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Sistema de Puntuación:</p>
              <ul className="space-y-1">
                <li>• 100 puntos - Sin pistas</li>
                <li>• 50 puntos - Con 1 pista</li>
                <li>• 25 puntos - Con 2 pistas</li>
                <li>• 0 puntos - Respuesta incorrecta</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGame;