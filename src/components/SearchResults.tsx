
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music } from 'lucide-react';

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

interface SearchResultsProps {
  results: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  isLoading: boolean;
}

export const SearchResults = ({ results, onPlayVideo, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="glass-effect">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted/20 rounded-full mb-4">
          <Music className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Inizia la tua ricerca</h3>
        <p className="text-muted-foreground">
          Cerca i tuoi artisti e brani preferiti per iniziare ad ascoltare musica
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-primary" />
        Risultati di ricerca ({results.length})
      </h2>
      
      {results.map((video, index) => (
        <Card 
          key={video.id.videoId}
          className="glass-effect hover:bg-accent/10 transition-all duration-300 hover:scale-[1.02] animate-slide-up group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-32 h-24 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.snippet.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                  {video.snippet.description}
                </p>
                
                <Button
                  onClick={() => onPlayVideo(video)}
                  size="sm"
                  className="h-8 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Riproduci
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
