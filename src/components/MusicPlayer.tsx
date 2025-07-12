
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SearchResults } from '@/components/SearchResults';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { Home, Search, Music, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MusicPlayerProps {
  apiKey: string;
  onGoHome: () => void;
}

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    description: string;
  };
}

export const MusicPlayer = ({ apiKey, onGoHome }: MusicPlayerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchVideos = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Errore nella ricerca');
      }
      
      const data = await response.json();
      setSearchResults(data.items || []);
      
      if (data.items?.length === 0) {
        toast({
          title: "Nessun risultato",
          description: "Non ho trovato brani per la tua ricerca. Prova con altri termini.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore ricerca:', error);
      toast({
        title: "Errore di ricerca",
        description: "Si è verificato un errore durante la ricerca. Controlla la tua chiave API.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos(searchQuery);
  };

  const handlePlayVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    toast({
      title: "Riproduzione avviata",
      description: `Ora in riproduzione: ${video.snippet.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold font-display gradient-text">
                Radio YATI
              </h1>
            </div>
            
            <Button
              onClick={onGoHome}
              variant="ghost"
              size="sm"
              className="hover:bg-accent/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="glass-effect mb-8 animate-fade-in">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca artisti, brani, album..."
                  className="h-12 text-base"
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={!searchQuery.trim() || isSearching}
                className="px-8 transition-all duration-300 hover:scale-105"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            <SearchResults 
              results={searchResults}
              onPlayVideo={handlePlayVideo}
              isLoading={isSearching}
            />
          </div>

          {/* Player */}
          <div className="lg:col-span-1">
            <YouTubePlayer currentVideo={currentVideo} />
          </div>
        </div>
      </div>
    </div>
  );
};
