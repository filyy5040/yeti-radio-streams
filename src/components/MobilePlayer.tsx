
import { useState, useRef } from 'react';
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
  const playerControlsRef = useRef<any>(null);

  // Trova il player dal YouTubePlayer component
  const getYouTubePlayer = () => {
    // Cerchiamo il player globale creato dal YouTubePlayer
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
    if (iframes.length > 0) {
      const iframe = iframes[0] as any;
      return iframe.contentWindow?.YT || window.YT?.get?.(iframe.id);
    }
    return null;
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

                {/* Messaggio per i controlli */}
                <div className="text-center text-muted-foreground text-sm mb-4">
                  I controlli del player sono gestiti dalla versione desktop.
                  Chiudi questo pannello per accedere ai controlli completi.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
