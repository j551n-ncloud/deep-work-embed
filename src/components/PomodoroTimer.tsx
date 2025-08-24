import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FocusSession as SessionType, PomodoroPhase } from '@/hooks/useSessionPersistence';
import { 
  Play,
  Pause,
  RotateCcw,
  X,
  Coffee,
  Brain,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  session: SessionType;
  onUpdateSession: (updates: Partial<SessionType>) => void;
  onEndSession: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export function PomodoroTimer({ 
  session, 
  onUpdateSession, 
  onEndSession, 
  timeRemaining, 
  setTimeRemaining,
  isPaused,
  setIsPaused
}: PomodoroTimerProps) {
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const getNextPhase = (): { phase: PomodoroPhase; duration: number } => {
    const currentRound = session.pomodoroRound || 1;
    const totalRounds = session.totalPomodoroRounds || 4;
    const currentPhase = session.pomodoroPhase || 'focus';

    if (currentPhase === 'focus') {
      // After focus, determine break type
      if (currentRound >= totalRounds) {
        return { phase: 'long-break', duration: (session.longBreakDuration || 15) * 60 };
      } else {
        return { phase: 'short-break', duration: (session.shortBreakDuration || 5) * 60 };
      }
    } else {
      // After any break, go to focus
      const nextRound = currentPhase === 'long-break' ? 1 : currentRound + 1;
      return { phase: 'focus', duration: (session.focusDuration || 25) * 60 };
    }
  };

  const handlePhaseComplete = useCallback(() => {
    const currentPhase = session.pomodoroPhase || 'focus';
    const currentRound = session.pomodoroRound || 1;
    const totalRounds = session.totalPomodoroRounds || 4;

    playNotificationSound();

    if (currentPhase === 'focus') {
      // Focus session completed
      toast({
        title: "🎉 Focus Session Complete!",
        description: `Great work! Time for a ${currentRound >= totalRounds ? 'long' : 'short'} break.`,
        duration: 5000,
      });

      // Update calendar data for focus sessions only
      const today = new Date().toISOString().split('T')[0];
      const calendarData = JSON.parse(localStorage.getItem('focus-calendar') || '{}');
      const durationHours = (session.focusDuration || 25) / 60;
      calendarData[today] = (calendarData[today] || 0) + durationHours;
      localStorage.setItem('focus-calendar', JSON.stringify(calendarData));
    } else {
      // Break completed
      toast({
        title: "☕ Break Complete!",
        description: "Ready to focus again? Let's get back to work!",
        duration: 3000,
      });
    }

    const { phase: nextPhase, duration: nextDuration } = getNextPhase();
    const nextRound = currentPhase === 'long-break' ? 1 : 
                     currentPhase === 'short-break' ? currentRound + 1 : currentRound;

    // Check if we've completed all rounds
    if (currentPhase === 'long-break') {
      toast({
        title: "🏆 Pomodoro Session Complete!",
        description: `Amazing! You've completed ${totalRounds} focus rounds.`,
        duration: 5000,
      });
      onEndSession();
      return;
    }

    // Transition to next phase
    setTimeRemaining(nextDuration);
    onUpdateSession({
      pomodoroPhase: nextPhase,
      pomodoroRound: nextRound,
      timeRemaining: nextDuration,
      duration: Math.floor(nextDuration / 60),
    });

  }, [session, onUpdateSession, onEndSession, setTimeRemaining, toast]);

  // Handle timer reaching zero
  useEffect(() => {
    if (timeRemaining === 0) {
      handlePhaseComplete();
    }
  }, [timeRemaining, handlePhaseComplete]);

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    onUpdateSession({ isPaused: newPaused });
  };

  const resetCurrentPhase = () => {
    if (window.confirm('Reset current phase to full duration?')) {
      const currentPhase = session.pomodoroPhase || 'focus';
      let resetDuration: number;
      
      switch (currentPhase) {
        case 'focus':
          resetDuration = (session.focusDuration || 25) * 60;
          break;
        case 'short-break':
          resetDuration = (session.shortBreakDuration || 5) * 60;
          break;
        case 'long-break':
          resetDuration = (session.longBreakDuration || 15) * 60;
          break;
      }
      
      setTimeRemaining(resetDuration);
      onUpdateSession({ timeRemaining: resetDuration });
    }
  };

  const skipPhase = () => {
    if (window.confirm('Skip to next phase?')) {
      handlePhaseComplete();
    }
  };

  const getPhaseInfo = () => {
    const phase = session.pomodoroPhase || 'focus';
    const round = session.pomodoroRound || 1;
    const totalRounds = session.totalPomodoroRounds || 4;

    switch (phase) {
      case 'focus':
        return {
          icon: <Brain className="h-5 w-5" />,
          title: 'Focus Time',
          subtitle: `Round ${round} of ${totalRounds}`,
          color: 'bg-red-500/20 border-red-500/30 text-red-400'
        };
      case 'short-break':
        return {
          icon: <Coffee className="h-5 w-5" />,
          title: 'Short Break',
          subtitle: `After Round ${round - 1}`,
          color: 'bg-green-500/20 border-green-500/30 text-green-400'
        };
      case 'long-break':
        return {
          icon: <Timer className="h-5 w-5" />,
          title: 'Long Break',
          subtitle: 'Well deserved rest!',
          color: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="flex flex-col items-center mb-8">
      {/* Phase Indicator */}
      <Badge className={`mb-6 px-4 py-2 backdrop-blur-sm ${phaseInfo.color}`}>
        <div className="flex items-center gap-2">
          {phaseInfo.icon}
          <div className="text-center">
            <div className="font-semibold">{phaseInfo.title}</div>
            <div className="text-xs opacity-80">{phaseInfo.subtitle}</div>
          </div>
        </div>
      </Badge>

      {/* Timer Display */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white text-2xl font-mono font-bold tracking-wider">
          {formatTime(timeRemaining)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onEndSession}
            size="sm"
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-full w-8 h-8 p-0"
            variant="ghost"
            title="End Session"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={togglePause}
            size="sm"
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-full w-8 h-8 p-0"
            variant="ghost"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={resetCurrentPhase}
            size="sm"
            className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 rounded-full w-8 h-8 p-0"
            variant="ghost"
            title="Reset Phase"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: session.totalPomodoroRounds || 4 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < (session.pomodoroRound || 1) - 1
                ? 'bg-green-500' // Completed
                : i === (session.pomodoroRound || 1) - 1
                ? 'bg-red-500' // Current
                : 'bg-gray-600' // Upcoming
            }`}
          />
        ))}
      </div>

      {/* Skip Phase Button */}
      <Button
        onClick={skipPhase}
        variant="outline"
        size="sm"
        className="bg-white/5 border-white/20 text-white/70 hover:bg-white/10 text-xs"
      >
        Skip Phase
      </Button>
    </div>
  );
}