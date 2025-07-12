
import { useState, useEffect } from 'react';
import { ApiKeyForm } from '@/components/ApiKeyForm';
import { Homepage } from '@/components/Homepage';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/hooks/use-toast';

type AppStage = 'api-key' | 'homepage' | 'player';

const Index = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>('api-key');
  const [apiKey, setApiKey] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Applica il tema al documento
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    // Controlla se c'è già una chiave API salvata
    const savedApiKey = localStorage.getItem('youtube-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setCurrentStage('homepage');
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('youtube-api-key', key);
    setCurrentStage('homepage');
    toast({
      title: "Chiave API configurata!",
      description: "Ora puoi iniziare ad ascoltare la tua musica preferita.",
    });
  };

  const handleStartListening = () => {
    setCurrentStage('player');
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
      
      {currentStage === 'api-key' && (
        <ApiKeyForm onSubmit={handleApiKeySubmit} />
      )}
      
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
