import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContributionCalendar } from './ContributionCalendar';
import { SessionType } from '@/hooks/useSessionPersistence';
import { Timer, Target, Youtube, Calendar, Lock, Brain, Coffee, Zap, Briefcase } from 'lucide-react';

interface ClockoutTaskInputProps {
  onStartSession: (task: string, duration: number, youtubeUrl?: string, sessionType?: SessionType, pomodoroOptions?: any) => void;
}

export function ClockoutTaskInput({ onStartSession }: ClockoutTaskInputProps) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(25);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('pomodoro');
  const [pomodoroRounds, setPomodoroRounds] = useState(4);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  // Update durations when session type changes
  const handleSessionTypeChange = (newSessionType: SessionType) => {
    setSessionType(newSessionType);
    
    if (newSessionType === 'work-day') {
      setFocusDuration(50);
      setShortBreakDuration(10);
      setLongBreakDuration(60);
      setPomodoroRounds(8);
    } else if (newSessionType === 'pomodoro') {
      setFocusDuration(25);
      setShortBreakDuration(5);
      setLongBreakDuration(15);
      setPomodoroRounds(4);
    }
  };


  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateYouTubeUrl = (url: string) => {
    if (!url) return true;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && duration > 0) {
      const pomodoroOptions = sessionType === 'pomodoro' ? {
        rounds: pomodoroRounds,
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
      } : sessionType === 'work-day' ? {
        rounds: 8,
        focusDuration: 50,
        shortBreakDuration: 10,
        longBreakDuration: 60,
      } : undefined;
      
      onStartSession(task.trim(), duration, youtubeUrl || undefined, sessionType, pomodoroOptions);
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Empty space for balance */}
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-black/40 border-white/20 text-white backdrop-blur-sm px-3 py-1">
            <Lock className="h-4 w-4 mr-2" />
            Days Locked In: 0
          </Badge>
          
          <Button
            variant="outline"
            onClick={() => setShowCalendar(true)}
            className="bg-black/40 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full max-w-2xl bg-black/60 backdrop-blur-sm border-white/20">
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

              {/* Session Type Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2 text-white">
                  <Timer className="h-4 w-4" />
                  Session Type
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      sessionType === 'pomodoro' 
                        ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => handleSessionTypeChange('pomodoro')}
                  >
                    <CardContent className="p-4 text-center">
                      <Brain className="h-8 w-8 mx-auto mb-2 text-red-400" />
                      <h3 className="font-semibold text-white mb-1">Pomodoro</h3>
                      <p className="text-xs text-white/70">25min focus + 5min breaks</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      sessionType === 'deep-work' 
                        ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => handleSessionTypeChange('deep-work')}
                  >
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <h3 className="font-semibold text-white mb-1">Deep Work</h3>
                      <p className="text-xs text-white/70">90min uninterrupted focus</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      sessionType === 'work-day' 
                        ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => handleSessionTypeChange('work-day')}
                  >
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <h3 className="font-semibold text-white mb-1">Work Day</h3>
                      <p className="text-xs text-white/70">8hr day with 1hr breaks</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      sessionType === 'custom' 
                        ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => handleSessionTypeChange('custom')}
                  >
                    <CardContent className="p-4 text-center">
                      <Timer className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <h3 className="font-semibold text-white mb-1">Custom</h3>
                      <p className="text-xs text-white/70">Set your own duration</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pomodoro Settings */}
                {sessionType === 'pomodoro' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Pomodoro Settings
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-sm text-white/80">Rounds</Label>
                        <Input
                          type="number"
                          min="1"
                          max="8"
                          value={pomodoroRounds}
                          onChange={(e) => setPomodoroRounds(parseInt(e.target.value))}
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-white/80">Focus (min)</Label>
                        <Input
                          type="number"
                          min="15"
                          max="60"
                          value={focusDuration}
                          onChange={(e) => setFocusDuration(parseInt(e.target.value))}
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-white/80">Short Break</Label>
                        <Input
                          type="number"
                          min="3"
                          max="15"
                          value={shortBreakDuration}
                          onChange={(e) => setShortBreakDuration(parseInt(e.target.value))}
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-white/80">Long Break</Label>
                        <Input
                          type="number"
                          min="10"
                          max="30"
                          value={longBreakDuration}
                          onChange={(e) => setLongBreakDuration(parseInt(e.target.value))}
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Duration and YouTube URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration - only show for custom sessions */}
                {sessionType === 'custom' && (
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
                )}

                {/* Auto-set duration for preset session types */}
                {sessionType === 'deep-work' && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2 text-white">
                      <Timer className="h-4 w-4" />
                      Duration
                    </Label>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-white font-semibold">90 minutes</p>
                      <p className="text-white/70 text-sm">Optimal for deep work sessions</p>
                    </div>
                  </div>
                )}

                {sessionType === 'pomodoro' && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2 text-white">
                      <Timer className="h-4 w-4" />
                      Total Duration
                    </Label>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-white font-semibold">
                        {pomodoroRounds * focusDuration + (pomodoroRounds - 1) * shortBreakDuration + longBreakDuration} minutes
                      </p>
                      <p className="text-white/70 text-sm">
                        {pomodoroRounds} rounds of {focusDuration}min focus + breaks
                      </p>
                    </div>
                  </div>
                )}

                {sessionType === 'work-day' && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2 text-white">
                      <Timer className="h-4 w-4" />
                      Work Day Schedule
                    </Label>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-white font-semibold">8 hours total</p>
                      <p className="text-white/70 text-sm">
                        8 rounds of 50min work + 10min breaks + 1hr lunch
                      </p>
                      <div className="mt-2 text-xs text-white/60">
                        <div>• Work blocks: 50 minutes</div>
                        <div>• Short breaks: 10 minutes</div>
                        <div>• Lunch break: 60 minutes (after 4th round)</div>
                      </div>
                    </div>
                  </div>
                )}

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

      {/* Modals */}
      <ContributionCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
}