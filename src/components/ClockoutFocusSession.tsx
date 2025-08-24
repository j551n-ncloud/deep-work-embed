import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FocusSession as SessionType } from '@/hooks/useSessionPersistence';
import { TaskSidebar } from './TaskSidebar';
import { ContributionCalendar } from './ContributionCalendar';
import { 
  Lock, 
  Unlock, 
  StopCircle, 
  CheckCircle2, 
  Trophy, 
  Calendar,
  Menu,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClockoutFocusSessionProps {
  session: SessionType;
  onUpdateSession: (updates: Partial<SessionType>) => void;
  onEndSession: () => void;
}

export function ClockoutFocusSession({ session, onUpdateSession, onEndSession }: ClockoutFocusSessionProps) {
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTaskSidebar, setShowTaskSidebar] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isPaused, setIsPaused] = useState(session.isPaused);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerComplete = useCallback(() => {
    setIsCompleted(true);
    onUpdateSession({ isActive: false, timeRemaining: 0 });
    
    // Update calendar data
    const today = new Date().toISOString().split('T')[0];
    const calendarData = JSON.parse(localStorage.getItem('focus-calendar') || '{}');
    const durationHours = session.duration / 60;
    calendarData[today] = (calendarData[today] || 0) + durationHours;
    localStorage.setItem('focus-calendar', JSON.stringify(calendarData));
    
    toast({
      title: "🎉 Focus Session Complete!",
      description: `You've successfully completed your ${session.duration}-minute focus session.`,
      duration: 5000,
    });
  }, [onUpdateSession, session.duration, toast]);

  // Timer countdown effect
  useEffect(() => {
    if (!session.isActive || isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        onUpdateSession({ timeRemaining: newTime });
        
        if (newTime <= 0) {
          handleTimerComplete();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isActive, isPaused, isCompleted, onUpdateSession, handleTimerComplete]);

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this focus session early?')) {
      onEndSession();
      toast({
        title: "Session Ended",
        description: "Your focus session has been ended.",
      });
    }
  };

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    onUpdateSession({ isPaused: newPaused });
  };

  const resetTimer = () => {
    if (window.confirm('Reset timer to original duration?')) {
      const resetTime = session.duration * 60;
      setTimeRemaining(resetTime);
      onUpdateSession({ timeRemaining: resetTime });
    }
  };

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = session.youtubeUrl ? getVideoId(session.youtubeUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}` : null;

  const getSessionStatus = () => {
    if (isCompleted) return { text: 'Completed', variant: 'default' as const, icon: Trophy };
    if (isPaused) return { text: 'Paused', variant: 'secondary' as const, icon: Unlock };
    return { text: 'Locked In', variant: 'destructive' as const, icon: Lock };
  };

  const status = getSessionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      {embedUrl && (
        <iframe
          src={embedUrl}
          className="video-background"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      
      {/* Overlay */}
      <div className="focus-overlay" />

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 glass-panel">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTaskSidebar(true)}
            className="text-white hover:bg-white/20"
          >
            <Menu className="h-4 w-4 mr-2" />
            Tasks
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalendar(true)}
            className="text-white hover:bg-white/20"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant={status.variant} className="glass-panel border-white/30 text-white">
            <StatusIcon className="mr-2 h-4 w-4" />
            Days Locked In: 0
          </Badge>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] px-4">
        {!isCompleted && (
          <div className="text-center mb-8">
            <p className="text-white/80 text-lg mb-2">Ready to lock in on your idea?</p>
          </div>
        )}

        {/* Timer */}
        <div className="timer-display mb-8">
          {formatTime(timeRemaining)}
        </div>

        {/* Controls */}
        {!isCompleted && (
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={togglePause}
              size="lg"
              className="glass-panel border-white/30 text-white hover:bg-white/20"
              variant="ghost"
            >
              {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              className="glass-panel border-white/30 text-white hover:bg-white/20"
              variant="ghost"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={handleEndSession}
              size="lg"
              className="glass-panel border-white/30 text-white hover:bg-red-500/20"
              variant="ghost"
            >
              <StopCircle className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Task Categories */}
        <div className="flex gap-4">
          <div className="task-category">
            <span>📝 Code</span>
          </div>
          <div className="task-category">
            <span>📊 Market</span>
          </div>
          <div className="task-category">
            <span>🎨 Design</span>
          </div>
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className="text-center mt-8 glass-panel p-8 rounded-2xl border-white/20">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-white/70 text-lg mb-6">
              Amazing focus! You've completed your {session.duration}-minute deep work session.
            </p>
            <Button onClick={onEndSession} size="lg" className="bg-primary hover:bg-primary/90">
              Start New Session
            </Button>
          </div>
        )}
      </div>

      {/* Task Sidebar */}
      <TaskSidebar isOpen={showTaskSidebar} onClose={() => setShowTaskSidebar(false)} />
      
      {/* Calendar Modal */}
      <ContributionCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
}