
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Play, Search, Headphones, Smartphone, Zap } from 'lucide-react';

interface HomepageProps {
  onStartListening: () => void;
}

export const Homepage = ({ onStartListening }: HomepageProps) => {
  const features = [
    {
      icon: Search,
      title: 'Ricerca Avanzata',
      description: 'Trova facilmente i tuoi brani preferiti con la ricerca intelligente'
    },
    {
      icon: Headphones,
      title: 'Qualità Premium',
      description: 'Streaming musicale in alta qualità direttamente da YouTube'
    },
    {
      icon: Smartphone,
      title: 'Design Responsive',
      description: 'Perfetta su desktop, tablet e dispositivi mobili'
    },
    {
      icon: Zap,
      title: 'Veloce e Fluido',
      description: 'Interfaccia ottimizzata per una navigazione senza interruzioni'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            {/* Logo animato */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8 animate-pulse-glow">
              <Music className="w-12 h-12 text-primary animate-bounce-in" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display gradient-text mb-6">
              Radio YATI
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La tua esperienza musicale moderna. Scopri, ascolta e goditi la musica 
              come mai prima d'ora con la potenza di YouTube.
            </p>
            
            {/* CTA Button */}
            <Button
              onClick={onStartListening}
              size="lg"
              className="h-16 px-12 text-xl font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 animate-bounce-in group"
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              INIZIA AD ASCOLTARE
            </Button>
          </div>
        </div>
        
        {/* Elementi decorativi animati */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Funzionalità Premium
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tutto quello di cui hai bisogno per la tua esperienza musicale perfetta
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="glass-effect hover:bg-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slide-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Come Funziona
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              Radio YATI utilizza la potente API di YouTube per offrirti accesso 
              a milioni di brani musicali direttamente nel tuo browser.
            </p>
            <p>
              Cerca i tuoi artisti preferiti, scopri nuova musica e crea 
              la tua playlist perfetta con un'interfaccia moderna e intuitiva.
            </p>
            <p className="text-primary font-medium">
              Nessuna registrazione richiesta. Inizia subito la tua esperienza musicale!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
