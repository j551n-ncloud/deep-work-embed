import { useState } from 'react';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { ClockoutTaskInput } from '@/components/ClockoutTaskInput';
import { ClockoutFocusSession } from '@/components/ClockoutFocusSession';

const Index = () => {
  const { session, createSession, updateSession, endSession } = useSessionPersistence();

  const handleStartSession = (task: string, duration: number, youtubeUrl?: string, sessionType?: any, pomodoroOptions?: any) => {
    // Set duration based on session type
    let actualDuration = duration;
    if (sessionType === 'deep-work') {
      actualDuration = 90;
    } else if (sessionType === 'pomodoro') {
      actualDuration = pomodoroOptions?.focusDuration || 25;
    }
    
    createSession(task, actualDuration, youtubeUrl, sessionType, pomodoroOptions);
  };

  // If user has an active session
  if (session?.isActive) {
    return (
      <ClockoutFocusSession 
        session={session}
        onUpdateSession={updateSession}
        onEndSession={endSession}
      />
    );
  }

  // Main task input
  return <ClockoutTaskInput onStartSession={handleStartSession} />;
};

export default Index;
