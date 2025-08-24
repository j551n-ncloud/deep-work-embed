import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { YouTubeEmbed } from './YouTubeEmbed';
import { FocusSession as SessionType } from '@/hooks/useSessionPersistence';
import { Lock, Unlock, StopCircle, Target, Timer, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FocusSessionProps {
  session: SessionType;
  onUpdateSession: (updates: Partial<SessionType>) => void;
  onEndSession: () => void;
}

export function FocusSession({ session, onUpdateSession, onEndSession }: FocusSessionProps) {
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining);
  const [isCompleted, setIsCompleted] = useState(false);
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
    toast({
      title: "🎉 Focus Session Complete!",
      description: `You've successfully completed your ${session.duration}-minute focus session.`,
      duration: 5000,
    });
  }, [onUpdateSession, session.duration, toast]);

  // Timer countdown effect
  useEffect(() => {
    if (!session.isActive || session.isPaused || isCompleted) return;

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
  }, [session.isActive, session.isPaused, isCompleted, onUpdateSession, handleTimerComplete]);

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this focus session early?')) {
      onEndSession();
      toast({
        title: "Session Ended",
        description: "Your focus session has been ended.",
      });
    }
  };

  const getSessionStatus = () => {
    if (isCompleted) return { text: 'Completed', variant: 'default' as const, icon: Trophy };
    if (session.isPaused) return { text: 'Paused', variant: 'secondary' as const, icon: Unlock };
    return { text: 'Locked In', variant: 'destructive' as const, icon: Lock };
  };

  const status = getSessionStatus();
  const StatusIcon = status.icon;
  const progress = ((session.duration * 60 - timeRemaining) / (session.duration * 60)) * 100;

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header with status and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={status.variant} className={`focus-badge ${isCompleted ? '' : 'locked-state'}`}>
            <StatusIcon className="mr-2 h-4 w-4" />
            {status.text}
          </Badge>
          
          <div className="text-sm text-muted-foreground">
            Session {session.id.slice(0, 8)}
          </div>
        </div>

        {!isCompleted && (
          <Button variant="outline" onClick={handleEndSession} className="hover:bg-destructive hover:text-destructive-foreground">
            <StopCircle className="mr-2 h-4 w-4" />
            End Session
          </Button>
        )}
      </div>

      {/* Timer Display */}
      <Card className="text-center">
        <CardContent className="pt-8">
          <div className="timer-display text-center mb-4">
            {formatTime(timeRemaining)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-muted-foreground">
            {Math.round(progress)}% complete • {session.duration} minute session
          </div>
        </CardContent>
      </Card>

      {/* Task Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Focus Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{session.task}</p>
        </CardContent>
      </Card>

      {/* YouTube Video */}
      {session.youtubeUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Focus Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <YouTubeEmbed 
              url={session.youtubeUrl} 
              autoPlay={session.isActive && !session.isPaused}
            />
          </CardContent>
        </Card>
      )}

      {/* Completion message */}
      {isCompleted && (
        <Card className="border-focus-complete bg-focus-complete/10">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-16 w-16 text-focus-complete mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-muted-foreground mb-4">
              You've successfully completed your focus session. Take a moment to appreciate your accomplishment.
            </p>
            <Button onClick={onEndSession} variant="outline" size="lg">
              Start New Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}