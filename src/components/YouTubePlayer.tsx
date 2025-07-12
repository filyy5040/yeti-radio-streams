
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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

interface YouTubePlayerProps {
  currentVideo: VideoItem | null;
}

export const YouTubePlayer = ({ currentVideo }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    // Carica l'API di YouTube se non è già presente
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Callback globale per quando l'API è pronta
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
      };
    }
  }, []);

  useEffect(() => {
    if (currentVideo && window.YT) {
      initializePlayer();
    }
  }, [currentVideo]);

  useEffect(() => {
    // Aggiorna il progresso ogni secondo quando in riproduzione
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const current = playerRef.current.getCurrentTime();
        setCurrentTime(current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const initializePlayer = () => {
    if (!currentVideo) return;

    // Distruggi il player esistente se presente
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Crea un nuovo player invisibile
    playerRef.current = new window.YT.Player('youtube-player', {
      width: '1',
      height: '1',
      videoId: currentVideo.id.videoId,
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
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerRef.current) return;
    const seekTime = value[0];
    playerRef.current.seekTo(seekTime);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current) return;
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      setVolume(playerRef.current.getVolume());
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return (
      <Card className="glass-effect sticky top-32 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Player
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted/20 rounded-full mb-4">
            <Play className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nessun brano selezionato</h3>
          <p className="text-muted-foreground text-sm">
            Seleziona un brano dai risultati di ricerca per iniziare la riproduzione
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect sticky top-32 animate-bounce-in">
      {/* Player YouTube nascosto */}
      <div id="youtube-player" className="sr-only"></div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Ora in riproduzione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Copertina del brano */}
        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 relative group">
          <img
            src={currentVideo.snippet.thumbnails.medium.url}
            alt={currentVideo.snippet.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Indicatore di riproduzione animato */}
          {isPlaying && (
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        
        {/* Info del brano */}
        <div className="space-y-1 text-center">
          <h3 className="font-semibold text-lg line-clamp-2">
            {currentVideo.snippet.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {currentVideo.snippet.channelTitle}
          </p>
        </div>
        
        {/* Barra di progresso */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
            disabled={!isPlayerReady}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controlli di riproduzione */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipSeconds(-10)}
            disabled={!isPlayerReady}
            className="hover:bg-accent/50"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlayPause}
            disabled={!isPlayerReady}
            className="w-14 h-14 rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipSeconds(10)}
            disabled={!isPlayerReady}
            className="hover:bg-accent/50"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Controlli volume */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-accent/50"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Dichiarazione globale per l'API YouTube
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
