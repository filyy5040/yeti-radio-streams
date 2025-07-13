
import { useState } from 'react';
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
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlayerReady: boolean;
  onTogglePlayPause: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onSkipSeconds: (seconds: number) => void;
}

export const MobilePlayer = ({
  currentVideo,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isPlayerReady,
  onTogglePlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkipSeconds
}: MobilePlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds: number) => {
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
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlayPause();
                }}
                disabled={!isPlayerReady}
                className="w-10 h-10 mr-2"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
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

            {/* Player espanso */}
            {isExpanded && (
              <div className="flex-1 flex flex-col p-6 pt-4">
                {/* Copertina grande */}
                <div className="flex-1 flex items-center justify-center mb-8">
                  <div className="w-72 h-72 max-w-[80vw] max-h-[40vh] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={currentVideo.snippet.thumbnails.medium.url}
                      alt={currentVideo.snippet.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info brano */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {currentVideo.snippet.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentVideo.snippet.channelTitle}
                  </p>
                </div>

                {/* Barra di progresso */}
                <div className="mb-6">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={onSeek}
                    className="w-full mb-2"
                    disabled={!isPlayerReady}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controlli principali */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSkipSeconds(-10)}
                    disabled={!isPlayerReady}
                    className="w-12 h-12"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={onTogglePlayPause}
                    disabled={!isPlayerReady}
                    className="w-16 h-16 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSkipSeconds(10)}
                    disabled={!isPlayerReady}
                    className="w-12 h-12"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                {/* Controlli volume */}
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onToggleMute}
                    className="w-10 h-10"
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
                    onValueChange={onVolumeChange}
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
