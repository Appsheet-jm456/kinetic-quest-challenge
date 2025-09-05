import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  HelpCircle, 
  List, 
  Lightbulb, 
  Users, 
  CheckSquare, 
  ArrowLeftRight, 
  Brain,
  Home
} from 'lucide-react';

interface GameSelectorProps {
  onGameSelect: (gameId: string) => void;
}

const games = [
  {
    id: 'yesno',
    title: 'Sí o No',
    description: 'Responde preguntas con opciones "Sí" o "No"',
    icon: HelpCircle,
    color: 'bg-primary'
  },
  {
    id: 'sortlist',
    title: 'Ordenar Lista',
    description: 'Arrastra elementos para ordenarlos correctamente',
    icon: List,
    color: 'bg-secondary'
  },
  {
    id: 'guess',
    title: 'Adivinanza',
    description: 'Escribe la respuesta a las pistas dadas',
    icon: Lightbulb,
    color: 'bg-accent'
  },
  {
    id: 'groups',
    title: 'Relacionar Grupos',
    description: 'Clasifica elementos en sus categorías correctas',
    icon: Users,
    color: 'bg-primary'
  },
  {
    id: 'multiplechoice',
    title: 'Opción Múltiple',
    description: 'Elige la respuesta correcta entre varias opciones',
    icon: CheckSquare,
    color: 'bg-secondary'
  },
  {
    id: 'columnmatch',
    title: 'Relacionar Columnas',
    description: 'Empareja elementos de diferentes columnas',
    icon: ArrowLeftRight,
    color: 'bg-accent'
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Encuentra las parejas de cartas iguales',
    icon: Brain,
    color: 'bg-primary'
  }
];

const GameSelector: React.FC<GameSelectorProps> = ({ onGameSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl border-2 border-primary/30 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Home className="w-10 h-10" />
              Juegos Educativos Interactivos
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Selecciona un juego para comenzar a jugar
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card 
                key={game.id}
                className="shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className={`${game.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-dark">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {game.description}
                  </p>
                  <Button
                    onClick={() => onGameSelect(game.id)}
                    className="w-full font-bold text-lg py-3"
                    size="lg"
                  >
                    Jugar Ahora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameSelector;