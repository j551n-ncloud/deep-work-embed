import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Target, Youtube } from 'lucide-react';

interface TaskInputProps {
  onStartSession: (task: string, duration: number, youtubeUrl?: string) => void;
}

export function TaskInput({ onStartSession }: TaskInputProps) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(25);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    if (!url) return true; // Optional field
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && duration > 0) {
      onStartSession(task.trim(), duration, youtubeUrl || undefined);
    }
  };

  const handleTaskChange = (value: string) => {
    setTask(value);
    setIsValid(value.trim().length > 0 && duration > 0);
  };

  const handleDurationChange = (value: string) => {
    const num = parseInt(value);
    setDuration(num);
    setIsValid(task.trim().length > 0 && num > 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Deep Focus Timer
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-lg">
            Lock into a single task until completion. No distractions, just pure focus.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="task" className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                What will you focus on?
              </Label>
              <Textarea
                id="task"
                placeholder="Enter your main task or goal for this session..."
                value={task}
                onChange={(e) => handleTaskChange(e.target.value)}
                className="min-h-[100px] text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="180"
                  value={duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  className="text-base"
                  required
                />
                <div className="flex gap-2 mt-2">
                  {[15, 25, 45, 60, 90].map((preset) => (
                    <Badge
                      key={preset}
                      variant={duration === preset ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleDurationChange(preset.toString())}
                    >
                      {preset}m
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-base font-semibold flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Video (optional)
                </Label>
                <Input
                  id="youtube"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="text-base"
                />
                {youtubeUrl && !validateYouTubeUrl(youtubeUrl) && (
                  <p className="text-destructive text-sm">Please enter a valid YouTube URL</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="focus"
              size="lg"
              disabled={!isValid || (youtubeUrl && !validateYouTubeUrl(youtubeUrl))}
              className="w-full text-lg py-6"
            >
              <Target className="mr-2 h-5 w-5" />
              Lock In & Start Focus Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}