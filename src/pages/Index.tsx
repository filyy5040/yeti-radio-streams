
import { useState, useEffect } from 'react';
import { Homepage } from '@/components/Homepage';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/hooks/use-toast';

type AppStage = 'homepage' | 'player';

const Index = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>('homepage');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Chiave API integrata direttamente
  const apiKey = 'AIzaSyDKGowJbLDoQwnXzvBd8V4TqRz0hVlPW7M';

  useEffect(() => {
    // Applica il tema al documento
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleStartListening = () => {
    setCurrentStage('player');
    toast({
      title: "Benvenuto in Radio YATI!",
      description: "Inizia a cercare la tua musica preferita.",
    });
  };

  const handleGoHome = () => {
    setCurrentStage('homepage');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      
      {currentStage === 'homepage' && (
        <Homepage onStartListening={handleStartListening} />
      )}
      
      {currentStage === 'player' && (
        <MusicPlayer apiKey={apiKey} onGoHome={handleGoHome} />
      )}
    </div>
  );
};

export default Index;
