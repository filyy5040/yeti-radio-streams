
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
      <div className="space-y-3 md:space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="glass-effect">
            <CardContent className="p-3 md:p-4">
              <div className="flex gap-3 md:gap-4">
                <div className="w-20 h-15 md:w-32 md:h-24 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3 md:block hidden" />
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
      <div className="text-center py-12 md:py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-muted/20 rounded-full mb-4">
          <Music className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">Inizia la tua ricerca</h3>
        <p className="text-muted-foreground text-sm md:text-base px-4">
          Cerca i tuoi artisti e brani preferiti per iniziare ad ascoltare musica
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 px-1">
        <Music className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        Risultati ({results.length})
      </h2>
      
      {results.map((video, index) => (
        <Card 
          key={video.id.videoId}
          className="glass-effect hover:bg-accent/10 transition-all duration-300 hover:scale-[1.01] animate-slide-up group cursor-pointer"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onPlayVideo(video)}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex gap-3 md:gap-4">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-20 h-15 md:w-32 md:h-24 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {video.snippet.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm mb-2">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-3 hidden md:block">
                    {video.snippet.description}
                  </p>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayVideo(video);
                  }}
                  size="sm"
                  className="h-7 md:h-8 px-3 md:px-4 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300 self-start"
                >
                  <Play className="w-3 h-3 mr-1" />
                  <span className="text-xs md:text-sm">Play</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
