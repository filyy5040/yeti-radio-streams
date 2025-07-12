
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Music, Key, ExternalLink } from 'lucide-react';

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyForm = ({ onSubmit }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    // Simula un breve caricamento per l'esperienza utente
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(apiKey.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo e Titolo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-bounce-in">
            <Music className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-display gradient-text mb-2">
            Radio YATI
          </h1>
          <p className="text-muted-foreground text-lg">
            La tua esperienza musicale moderna
          </p>
        </div>

        {/* Card del Form */}
        <Card className="glass-effect animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Configurazione API
            </CardTitle>
            <CardDescription className="text-base">
              Inserisci la tua chiave API YouTube v3 per iniziare
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-sm font-medium">
                  Chiave API YouTube v3
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Inserisci la tua chiave API..."
                  className="h-12 text-base"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                disabled={!apiKey.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Configurazione...
                  </div>
                ) : (
                  'Configura API'
                )}
              </Button>
            </form>

            {/* Link di aiuto */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Non hai una chiave API?
              </p>
              <a
                href="https://developers.google.com/youtube/v3/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ottieni la tua chiave API YouTube
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Info sulla privacy */}
        <p className="text-xs text-muted-foreground text-center mt-6 px-4">
          La tua chiave API viene salvata solo localmente nel tuo browser e non viene mai condivisa.
        </p>
      </div>
    </div>
  );
};
