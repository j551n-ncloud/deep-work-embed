import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { TaskInput } from '@/components/TaskInput';
import { FocusSession } from '@/components/FocusSession';

const Index = () => {
  const { session, createSession, updateSession, endSession } = useSessionPersistence();

  const handleStartSession = (task: string, duration: number, youtubeUrl?: string) => {
    createSession(task, duration, youtubeUrl);
  };

  if (session?.isActive) {
    return (
      <FocusSession 
        session={session}
        onUpdateSession={updateSession}
        onEndSession={endSession}
      />
    );
  }

  return (
    <TaskInput onStartSession={handleStartSession} />
  );
};

export default Index;
