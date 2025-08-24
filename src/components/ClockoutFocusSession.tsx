import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FocusSession as SessionType } from '@/hooks/useSessionPersistence';
import { ContributionCalendar } from './ContributionCalendar';
import { TaskSidebar } from './TaskSidebar';
import { PomodoroTimer } from './PomodoroTimer';
import { 
  Lock, 
  Trophy, 
  Calendar,
  Menu,
  Play,
  Pause,
  RotateCcw,
  X
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTaskSidebar, setShowTaskSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(session.isPaused);
  const [daysLockedIn, setDaysLockedIn] = useState(0);
  const { toast } = useToast();

  // Calculate consecutive days locked in
  const calculateDaysLockedIn = () => {
    const calendarData = JSON.parse(localStorage.getItem('focus-calendar') || '{}');
    const today = new Date();
    let consecutiveDays = 0;
    
    // Check backwards from today
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (calendarData[dateStr] && calendarData[dateStr] > 0) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    return consecutiveDays;
  };

  // Update days locked in on component mount and when calendar data changes
  useEffect(() => {
    setDaysLockedIn(calculateDaysLockedIn());
  }, []);

  // Update days locked in when session completes
  useEffect(() => {
    if (isCompleted) {
      setDaysLockedIn(calculateDaysLockedIn());
    }
  }, [isCompleted]);

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
    // For Pomodoro sessions, the PomodoroTimer handles completion
    if (session.sessionType === 'pomodoro') {
      return;
    }

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
  }, [onUpdateSession, session.duration, session.sessionType, toast]);

  // Timer countdown effect
  useEffect(() => {
    if (!session.isActive || isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        onUpdateSession({ timeRemaining: newTime });
        
        if (newTime <= 0) {
          if (session.sessionType === 'pomodoro') {
            // For Pomodoro, let PomodoroTimer handle completion
            return 0;
          } else {
            handleTimerComplete();
            return 0;
          }
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isActive, isPaused, isCompleted, onUpdateSession, handleTimerComplete, session.sessionType]);

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

  const handleTaskCategorySelect = (category: string) => {
    setSelectedCategory(category);
    toast({
      title: `${category} Selected`,
      description: `You've selected the ${category} category for this session.`,
      duration: 2000,
    });
    // Store category in localStorage for this session
    localStorage.setItem(`session-${session.id}-category`, category);
  };

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = session.youtubeUrl ? getVideoId(session.youtubeUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}` : null;



  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      {embedUrl && (
        <iframe
          src={embedUrl}
          className="video-background"
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 z-10" />

      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Empty space for balance */}
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-black/40 border-white/20 text-white backdrop-blur-sm px-3 py-1">
            <Lock className="h-4 w-4 mr-2" />
            Days Locked In: {daysLockedIn}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalendar(true)}
            className="bg-black/40 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTaskSidebar(true)}
            className="bg-black/40 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Top spacer - larger to push content to lower-middle */}
        <div className="flex-[2]"></div>

        {/* Lower-middle content section with text and timer */}
        <div className="flex flex-col items-center px-4">
          {/* Text above timer */}
          {!isCompleted && (
            <div className="text-center mb-8">
              <p className="text-white/90 text-lg">Ready to lock in on your idea?</p>
            </div>
          )}
          
          {/* Timer Display - Pomodoro or Regular */}
          {session.sessionType === 'pomodoro' ? (
            <PomodoroTimer
              session={session}
              onUpdateSession={onUpdateSession}
              onEndSession={onEndSession}
              timeRemaining={timeRemaining}
              setTimeRemaining={setTimeRemaining}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
          ) : (
            <div className="flex items-center gap-4 mb-8">
              {/* Regular Timer */}
              <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white text-2xl font-mono font-bold tracking-wider">
                {formatTime(timeRemaining)}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleEndSession}
                  size="sm"
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-full w-8 h-8 p-0"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePause}
                  size="sm"
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-full w-8 h-8 p-0"
                  variant="ghost"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  size="sm"
                  className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 rounded-full w-8 h-8 p-0"
                  variant="ghost"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Task Categories - Always show at bottom */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTaskCategorySelect('Code')}
              className={`backdrop-blur-sm transition-all duration-200 ${
                selectedCategory === 'Code' 
                  ? 'bg-blue-500/60 border-blue-400 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30'
              }`}
            >
              📝 Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTaskCategorySelect('Study')}
              className={`backdrop-blur-sm transition-all duration-200 ${
                selectedCategory === 'Study' 
                  ? 'bg-green-500/60 border-green-400 text-white shadow-lg shadow-green-500/20' 
                  : 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
              }`}
            >
              📊 Study
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTaskCategorySelect('Design')}
              className={`backdrop-blur-sm transition-all duration-200 ${
                selectedCategory === 'Design' 
                  ? 'bg-purple-500/60 border-purple-400 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
              }`}
            >
              🎨 Design
            </Button>
          </div>
        </div>
        
        {/* Bottom spacer - smaller to keep content in lower-middle */}
        <div className="flex-1 pb-16"></div>
      </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center bg-black/60 backdrop-blur-sm border border-white/20 p-8 rounded-2xl">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
              <p className="text-white/70 text-lg mb-6">
                Amazing focus! You've completed your {session.duration}-minute deep work session.
              </p>
              <Button onClick={onEndSession} size="lg" className="bg-primary hover:bg-primary/90">
                Start New Session
              </Button>
            </div>
          </div>
        )}

      {/* Task Sidebar */}
      <TaskSidebar isOpen={showTaskSidebar} onClose={() => setShowTaskSidebar(false)} />
      
      {/* Calendar Modal */}
      <ContributionCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
}