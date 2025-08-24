import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Play, Users } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('Bolt Builders');
  const [roomUrl, setRoomUrl] = useState('bolt-builders');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-black/90 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Room</h2>
            <p className="text-white/60 mt-1">Set up your public room and see a live preview</p>
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

        <div className="flex">
          {/* Left Side - Form */}
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Room Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-sm">Room Name</Label>
                  <Input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Room URL</Label>
                  <div className="flex mt-1">
                    <span className="bg-white/5 border border-white/20 border-r-0 rounded-l-md px-3 py-2 text-white/60 text-sm">
                      clockout.gg/
                    </span>
                    <Input
                      value={roomUrl}
                      onChange={(e) => setRoomUrl(e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white text-sm">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this room about? What are you building together?"
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Media & Avatar</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-sm">YouTube URL</Label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Room Avatar</Label>
                  <div className="mt-2 p-4 bg-white/5 border border-white/20 rounded-lg">
                    <p className="text-white/60 text-sm">Upload room avatar (coming soon)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-80 bg-white/5 border-l border-white/20 p-6">
            <div className="space-y-4">
              {/* Room Card Preview */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white text-lg">
                    ?
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Room Name</h4>
                    <p className="text-white/60 text-sm">clockout.gg/your-room</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>0 online</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Public</Badge>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">About</h4>
                <p className="text-white/60 text-sm">Room description will appear here...</p>
              </div>

              {/* Now Playing */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="h-4 w-4 text-white" />
                  <span className="text-white font-medium text-sm">Now Playing</span>
                </div>
                <div className="bg-white/5 border border-dashed border-white/30 rounded-lg p-8 text-center">
                  <Play className="h-8 w-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">YouTube video preview</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-white/60 text-xs">Members</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">New</div>
                  <div className="text-white/60 text-xs">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/20">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}