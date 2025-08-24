import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Music, 
  Timer, 
  Volume2, 
  VolumeX, 
  Plus,
  ChevronDown,
  Play
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-black/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Music & Settings</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Custom Music Section */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowCustom(!showCustom)}
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-red-500" />
                <span>Custom</span>
                <Badge variant="secondary" className="text-xs bg-white/10 text-white">2 items</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
            </Button>

            {showCustom && (
              <div className="space-y-3 pl-4">
                <Input
                  placeholder="Add YouTube content"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            )}
          </div>

          {/* Timer Presets */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Quick Timer</h4>
            <div className="grid grid-cols-3 gap-2">
              {['5m', '15m', '30m'].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  {time}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Timer className="h-4 w-4 mr-2" />
              Custom time
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
                <span className="text-white text-sm">Volume</span>
              </div>
              <span className="text-white text-sm">{isMuted ? '0' : volume[0]}%</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  disabled={isMuted}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-white/5 border border-white/20 text-white hover:bg-white/10 flex items-center justify-center gap-2"
              variant="outline"
            >
              <Music className="h-4 w-4" />
              Set personal music
            </Button>

            <Button
              className="w-full bg-white/5 border border-white/20 text-white hover:bg-white/10 flex items-center justify-center gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add YouTube content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}