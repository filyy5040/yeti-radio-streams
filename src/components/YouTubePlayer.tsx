
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Play } from 'lucide-react';

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
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carica l'API di YouTube se non è già presente
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Ora in riproduzione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player YouTube incorporato */}
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?autoplay=1&rel=0`}
            title={currentVideo.snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
        
        {/* Info del brano */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base line-clamp-2">
            {currentVideo.snippet.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {currentVideo.snippet.channelTitle}
          </p>
        </div>
        
        {/* Thumbnail di backup (nascosta, ma utile per il design) */}
        <div className="hidden">
          <img
            src={currentVideo.snippet.thumbnails.medium.url}
            alt={currentVideo.snippet.title}
            className="w-full h-32 object-cover rounded-lg"
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
