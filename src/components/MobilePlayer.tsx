
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

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

interface MobilePlayerProps {
  currentVideo: VideoItem | null;
}

export const MobilePlayer = ({ currentVideo }: MobilePlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  // Trova il player YouTube globale
  const getYouTubePlayer = () => {
    const iframe = document.querySelector('iframe[src*="youtube.com"]') as any;
    if (iframe && window.YT) {
      return window.YT.get?.(iframe.id) || iframe.contentWindow?.player;
    }
    return null;
  };

  // Aggiorna lo stato del player
  useEffect(() => {
    const updatePlayerState = () => {
      const player = getYouTubePlayer();
      if (player && typeof player.getPlayerState === 'function') {
        try {
          const state = player.getPlayerState();
          setIsPlaying(state === 1); // 1 = playing
          
          if (typeof player.getDuration === 'function') {
            const dur = player.getDuration();
            if (dur > 0) setDuration(dur);
          }
          
          if (typeof player.getCurrentTime === 'function') {
            const time = player.getCurrentTime();
            if (time >= 0) setCurrentTime(time);
          }
          
          if (typeof player.getVolume === 'function') {
            const vol = player.getVolume();
            if (vol >= 0) setVolume(vol);
          }
          
          if (typeof player.isMuted === 'function') {
            setIsMuted(player.isMuted());
          }
        } catch (error) {
          console.log('Error getting player state:', error);
        }
      }
    };

    if (isExpanded && currentVideo) {
      updatePlayerState();
      const interval = setInterval(updatePlayerState, 1000);
      return () => clearInterval(interval);
    }
  }, [isExpanded, currentVideo]);

  const togglePlayPause = () => {
    const player = getYouTubePlayer();
    if (player) {
      try {
        if (isPlaying) {
          player.pauseVideo?.();
        } else {
          player.playVideo?.();
        }
      } catch (error) {
        console.log('Error toggling play/pause:', error);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const player = getYouTubePlayer();
    if (player && typeof player.seekTo === 'function') {
      try {
        const seekTime = value[0];
        player.seekTo(seekTime);
        setCurrentTime(seekTime);
      } catch (error) {
        console.log('Error seeking:', error);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const player = getYouTubePlayer();
    if (player && typeof player.setVolume === 'function') {
      try {
        const newVolume = value[0];
        player.setVolume(newVolume);
        setVolume(newVolume);
        
        if (newVolume === 0) {
          setIsMuted(true);
        } else if (isMuted) {
          setIsMuted(false);
        }
      } catch (error) {
        console.log('Error changing volume:', error);
      }
    }
  };

  const toggleMute = () => {
    const player = getYouTubePlayer();
    if (player) {
      try {
        if (isMuted) {
          player.unMute?.();
          setIsMuted(false);
        } else {
          player.mute?.();
          setIsMuted(true);
        }
      } catch (error) {
        console.log('Error toggling mute:', error);
      }
    }
  };

  const skipSeconds = (seconds: number) => {
    const player = getYouTubePlayer();
    if (player && typeof player.seekTo === 'function') {
      try {
        const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
        player.seekTo(newTime);
        setCurrentTime(newTime);
      } catch (error) {
        console.log('Error skipping:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return null;
  }

  return (
    <>
      {/* Overlay quando espanso */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Player mobile */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        isExpanded ? 'h-screen' : 'h-20'
      }`}>
        <Card className="h-full rounded-t-2xl border-t border-x-0 border-b-0 shadow-2xl bg-background/95 backdrop-blur-md">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Mini player (sempre visibile) */}
            <div 
              className="flex items-center p-4 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <img
                src={currentVideo.snippet.thumbnails.medium.url}
                alt={currentVideo.snippet.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1 mx-3 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {currentVideo.snippet.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {currentVideo.snippet.channelTitle}
                </p>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Player espanso con controlli completi */}
            {isExpanded && (
              <div className="flex-1 flex flex-col p-6 pt-4">
                {/* Copertina grande */}
                <div className="flex-1 flex items-center justify-center mb-8">
                  <div className="w-72 h-72 max-w-[80vw] max-h-[40vh] rounded-2xl overflow-hidden shadow-2xl relative">
                    <img
                      src={currentVideo.snippet.thumbnails.medium.url}
                      alt={currentVideo.snippet.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Indicatore di riproduzione animato */}
                    {isPlaying && (
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info brano */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {currentVideo.snippet.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentVideo.snippet.channelTitle}
                  </p>
                </div>

                {/* Barra di progresso */}
                <div className="space-y-2 mb-6">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controlli di riproduzione */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skipSeconds(-10)}
                    className="hover:bg-accent/50 w-12 h-12"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skipSeconds(10)}
                    className="hover:bg-accent/50 w-12 h-12"
                  >
                    <SkipForward className="w-6 h-6" />
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
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
