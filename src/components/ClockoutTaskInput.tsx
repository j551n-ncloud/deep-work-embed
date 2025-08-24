import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContributionCalendar } from './ContributionCalendar';
import { Timer, Target, Youtube, Upload, Calendar, Plus, Lock } from 'lucide-react';

interface ClockoutTaskInputProps {
  onStartSession: (task: string, duration: number, youtubeUrl?: string) => void;
}

export function ClockoutTaskInput({ onStartSession }: ClockoutTaskInputProps) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(25);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateYouTubeUrl = (url: string) => {
    if (!url) return true;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && duration > 0) {
      onStartSession(task.trim(), duration, youtubeUrl || undefined);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          // Handle imported data (tasks, sessions, etc.)
          console.log('Imported data:', data);
        } catch (error) {
          console.error('Failed to parse imported file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const isValid = task.trim().length > 0 && duration > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="glass-panel border-white/20 text-white hover:bg-white/10">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge className="glass-panel border-white/20 text-white bg-white/5">
            <Lock className="h-4 w-4 mr-2" />
            Days Locked In: 0
          </Badge>
          
          <Button
            variant="outline"
            onClick={() => setShowCalendar(true)}
            className="glass-panel border-white/20 text-white hover:bg-white/10"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleImport}
            className="glass-panel border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full max-w-2xl glass-panel border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-white">
                Deep Focus Timer
              </CardTitle>
            </div>
            <p className="text-white/70 text-lg">
              Lock into a single task until completion. No distractions, just pure focus.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Input */}
              <div className="space-y-2">
                <Label htmlFor="task" className="text-base font-semibold flex items-center gap-2 text-white">
                  <Target className="h-4 w-4" />
                  What will you focus on?
                </Label>
                <Textarea
                  id="task"
                  placeholder="Enter your main task or goal for this session..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="min-h-[100px] text-base bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              {/* Duration and YouTube URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2 text-white">
                    <Timer className="h-4 w-4" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="text-base bg-white/5 border-white/20 text-white"
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    {[15, 25, 45, 60, 90].map((preset) => (
                      <Badge
                        key={preset}
                        variant={duration === preset ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors glass-panel border-white/20"
                        onClick={() => setDuration(preset)}
                      >
                        {preset}m
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-base font-semibold flex items-center gap-2 text-white">
                    <Youtube className="h-4 w-4" />
                    YouTube Video (optional)
                  </Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="text-base bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                  {youtubeUrl && !validateYouTubeUrl(youtubeUrl) && (
                    <p className="text-red-400 text-sm">Please enter a valid YouTube URL</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={!isValid || (youtubeUrl && !validateYouTubeUrl(youtubeUrl))}
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Lock className="mr-2 h-5 w-5" />
                Lock In & Start Focus Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".json"
        className="hidden"
      />

      {/* Calendar Modal */}
      <ContributionCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
}