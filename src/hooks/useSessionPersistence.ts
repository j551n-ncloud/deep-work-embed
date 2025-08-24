import { useState, useEffect } from 'react';

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

  const createSession = (task: string, duration: number, youtubeUrl?: string) => {
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