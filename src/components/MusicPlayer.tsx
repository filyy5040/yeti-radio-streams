
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SearchResults } from '@/components/SearchResults';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { MobilePlayer } from '@/components/MobilePlayer';
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
  
  // Stati del player per mobile
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerRef, setPlayerRef] = useState<any>(null);

  // Inizializzazione YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
      };
    }
  }, []);

  // Aggiorna progresso
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef && isPlaying) {
        const current = playerRef.getCurrentTime();
        setCurrentTime(current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, playerRef]);

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
    initializePlayer(video);
    toast({
      title: "Riproduzione avviata",
      description: `Ora in riproduzione: ${video.snippet.title}`,
    });
  };

  const initializePlayer = (video: VideoItem) => {
    if (playerRef) {
      playerRef.destroy();
    }

    const newPlayer = new window.YT.Player('youtube-player-hidden', {
      width: '1',
      height: '1',
      videoId: video.id.videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsPlayerReady(true);
          setDuration(event.target.getDuration());
          event.target.setVolume(volume);
          setIsPlaying(true);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        },
      },
    });

    setPlayerRef(newPlayer);
  };

  const togglePlayPause = () => {
    if (!playerRef) return;
    
    if (isPlaying) {
      playerRef.pauseVideo();
    } else {
      playerRef.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerRef) return;
    const seekTime = value[0];
    playerRef.seekTo(seekTime);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef) return;
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef) return;
    
    if (isMuted) {
      playerRef.unMute();
      setIsMuted(false);
      setVolume(playerRef.getVolume());
    } else {
      playerRef.mute();
      setIsMuted(true);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!playerRef) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.seekTo(newTime);
    setCurrentTime(newTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Player YouTube nascosto */}
      <div id="youtube-player-hidden" className="sr-only"></div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full">
                <Music className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold font-display gradient-text">
                Radio YATI
              </h1>
            </div>
            
            <Button
              onClick={onGoHome}
              variant="ghost"
              size="sm"
              className="hover:bg-accent/50 text-xs md:text-sm"
            >
              <Home className="w-4 h-4 mr-1 md:mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8">
        {/* Search Section */}
        <Card className="glass-effect mb-6 md:mb-8 animate-fade-in">
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSearch} className="flex gap-2 md:gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca artisti, brani, album..."
                  className="h-10 md:h-12 text-sm md:text-base"
                />
              </div>
              <Button 
                type="submit" 
                size="default"
                disabled={!searchQuery.trim() || isSearching}
                className="px-4 md:px-8 transition-all duration-300 hover:scale-105"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Search Results - Mobile: full width, Desktop: 2 colonne */}
          <div className="lg:col-span-2">
            <SearchResults 
              results={searchResults}
              onPlayVideo={handlePlayVideo}
              isLoading={isSearching}
            />
          </div>

          {/* Player Desktop - nascosto su mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <YouTubePlayer currentVideo={currentVideo} />
          </div>
        </div>
      </div>

      {/* Player Mobile */}
      <MobilePlayer
        currentVideo={currentVideo}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isPlayerReady={isPlayerReady}
        onTogglePlayPause={togglePlayPause}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onSkipSeconds={skipSeconds}
      />
    </div>
  );
};

// Dichiarazione globale per l'API YouTube
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
