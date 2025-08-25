import { useState, useEffect } from 'react';

export type SessionType = 'pomodoro' | 'deep-work' | 'work-day' | 'custom';
export type PomodoroPhase = 'focus' | 'short-break' | 'long-break' | 'lunch-break';

export interface FocusSession {
  id: string;
  task: string;
  duration: number; // in minutes
  startTime: number;
  endTime: number;
  youtubeUrl?: string;
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  sessionType: SessionType;
  // Pomodoro specific fields
  pomodoroPhase?: PomodoroPhase;
  pomodoroRound?: number; // Current round (1-4)
  totalPomodoroRounds?: number; // Total rounds planned
  focusDuration?: number; // Focus time in minutes (default 25)
  shortBreakDuration?: number; // Short break in minutes (default 5)
  longBreakDuration?: number; // Long break in minutes (default 15)
}

const SESSION_STORAGE_KEY = 'focus-session';

export function useSessionPersistence() {
  const [session, setSession] = useState<FocusSession | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      try {
        const parsedSession = JSON.parse(saved);
        // Check if session is still valid (not expired)
        if (parsedSession.isActive && Date.now() < parsedSession.endTime) {
          setSession(parsedSession);
        } else {
          // Clean up expired session
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to parse saved session:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const createSession = (
    task: string, 
    duration: number, 
    youtubeUrl?: string, 
    sessionType: SessionType = 'custom',
    pomodoroOptions?: {
      rounds?: number;
      focusDuration?: number;
      shortBreakDuration?: number;
      longBreakDuration?: number;
    }
  ) => {
    const now = Date.now();
    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      task,
      duration,
      startTime: now,
      endTime: now + (duration * 60 * 1000),
      youtubeUrl,
      isActive: true,
      isPaused: false,
      timeRemaining: duration * 60,
      sessionType,
      // Pomodoro defaults
      ...((sessionType === 'pomodoro' || sessionType === 'work-day') && {
        pomodoroPhase: 'focus' as PomodoroPhase,
        pomodoroRound: 1,
        totalPomodoroRounds: sessionType === 'work-day' ? 8 : (pomodoroOptions?.rounds || 4),
        focusDuration: sessionType === 'work-day' ? 50 : (pomodoroOptions?.focusDuration || 25),
        shortBreakDuration: sessionType === 'work-day' ? 10 : (pomodoroOptions?.shortBreakDuration || 5),
        longBreakDuration: sessionType === 'work-day' ? 60 : (pomodoroOptions?.longBreakDuration || 15),
      }),
    };
    setSession(newSession);
    return newSession;
  };

  const updateSession = (updates: Partial<FocusSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  };

  const endSession = () => {
    setSession(null);
  };

  const pauseSession = () => {
    if (session) {
      updateSession({ isPaused: true });
    }
  };

  const resumeSession = () => {
    if (session) {
      updateSession({ isPaused: false });
    }
  };

  return {
    session,
    createSession,
    updateSession,
    endSession,
    pauseSession,
    resumeSession,
  };
}