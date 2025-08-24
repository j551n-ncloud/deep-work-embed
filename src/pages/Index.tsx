import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { ClockoutTaskInput } from '@/components/ClockoutTaskInput';
import { ClockoutFocusSession } from '@/components/ClockoutFocusSession';

const Index = () => {
  const { session, createSession, updateSession, endSession } = useSessionPersistence();

  const handleStartSession = (task: string, duration: number, youtubeUrl?: string) => {
    createSession(task, duration, youtubeUrl);
  };

  if (session?.isActive) {
    return (
      <ClockoutFocusSession 
        session={session}
        onUpdateSession={updateSession}
        onEndSession={endSession}
      />
    );
  }

  return (
    <ClockoutTaskInput onStartSession={handleStartSession} />
  );
};

export default Index;
