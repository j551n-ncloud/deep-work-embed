import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeEmbedProps {
  url: string;
  autoPlay?: boolean;
  onStateChange?: (isPlaying: boolean) => void;
}

export function YouTubeEmbed({ url, autoPlay = false, onStateChange }: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(isPlaying);
    }
  }, [isPlaying, onStateChange]);

  const togglePlay = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isMuted) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  if (!videoId) {
    return (
      <div className="video-container flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`;

  return (
    <div className="video-container">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Custom Controls Overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="sm"
          onClick={togglePlay}
          className="bg-black/70 hover:bg-black/90 text-white border-none"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleMute}
          className="bg-black/70 hover:bg-black/90 text-white border-none"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}