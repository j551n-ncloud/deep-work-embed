import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MoreHorizontal, Calendar, CheckCircle2, Circle, FileText } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  type: 'Code' | 'Study' | 'Design';
  status: 'todo' | 'done';
  createdAt: Date;
  completedAt?: Date;
}

interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskSidebar({ isOpen, onClose }: TaskSidebarProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [taskType, setTaskType] = useState<Task['type']>('Code');

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focus-tasks');
    if (saved) {
      try {
        const parsedTasks = JSON.parse(saved).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('focus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: crypto.randomUUID(),
        title: newTask.trim(),
        type: taskType,
        status: 'todo',
        createdAt: new Date(),
      };
      setTasks(prev => [task, ...prev]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'todo' ? 'done' : 'todo',
            completedAt: task.status === 'todo' ? new Date() : undefined
          }
        : task
    ));
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'Code': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Study': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Design': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 sidebar-panel transform transition-transform duration-300 z-20 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Tasks</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            ×
          </Button>
        </div>

        {/* Add Task */}
        <Card className="p-3 mb-4 glass-panel border-white/10">
          <div className="space-y-3">
            <Input
              placeholder="What do you need to focus on?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
            />
            <div className="flex gap-2">
              <Select value={taskType} onValueChange={(value) => setTaskType(value as Task['type'])}>
                <SelectTrigger className="flex-1 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="Code">📝 Code</SelectItem>
                  <SelectItem value="Study">📊 Study</SelectItem>
                  <SelectItem value="Design">🎨 Design</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addTask} size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Task Tabs */}
        <Tabs defaultValue="todo" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="todo" className="text-white data-[state=active]:bg-white/20">
              To-Do
            </TabsTrigger>
            <TabsTrigger value="done" className="text-white data-[state=active]:bg-white/20">
              Done
            </TabsTrigger>
            <TabsTrigger value="log" className="text-white data-[state=active]:bg-white/20">
              Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="flex-1 overflow-auto space-y-2 mt-4">
            {todoTasks.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Ready to focus?</p>
                <p className="text-sm">Add your focused tasks to work on today.</p>
                <p className="text-sm">Stay productive and organized.</p>
              </div>
            ) : (
              todoTasks.map(task => (
                <Card key={task.id} className="p-3 glass-panel border-white/10">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTask(task.id)}
                      className="p-0 h-auto text-white/60 hover:text-white"
                    >
                      <Circle className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{task.title}</p>
                      <Badge className={`mt-1 text-xs ${getTypeColor(task.type)}`}>
                        {task.type}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="done" className="flex-1 overflow-auto space-y-2 mt-4">
            {doneTasks.map(task => (
              <Card key={task.id} className="p-3 glass-panel border-white/10">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTask(task.id)}
                    className="p-0 h-auto text-primary hover:text-primary/80"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <p className="text-white/70 text-sm leading-relaxed line-through">{task.title}</p>
                    <Badge className={`mt-1 text-xs ${getTypeColor(task.type)}`}>
                      {task.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="log" className="flex-1 overflow-auto space-y-2 mt-4">
            <div className="text-center py-8 text-white/60">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Activity log coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}