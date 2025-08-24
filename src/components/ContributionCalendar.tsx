import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';

interface CalendarData {
  [date: string]: number; // hours of deep work
}

interface ContributionCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContributionCalendar({ isOpen, onClose }: ContributionCalendarProps) {
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  // Load calendar data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focus-calendar');
    if (saved) {
      try {
        setCalendarData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse calendar data:', error);
      }
    }
  }, []);

  const getCurrentYear = () => new Date().getFullYear();
  
  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getCalendarLevel = (hours: number) => {
    if (hours === 0) return 0;
    if (hours < 1) return 1;
    if (hours < 2) return 2;
    if (hours < 4) return 3;
    return 4;
  };

  const generateCalendarGrid = () => {
    const year = getCurrentYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Start from the first Sunday before or on January 1st
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    const currentDate = new Date(firstSunday);
    
    // Generate 53 weeks to ensure full year coverage
    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const week = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = getDateString(currentDate);
        const hours = calendarData[dateStr] || 0;
        const level = getCalendarLevel(hours);
        
        week.push({
          date: new Date(currentDate),
          dateStr,
          hours,
          level,
          isCurrentYear: currentDate.getFullYear() === year,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
      
      // Stop if we've gone past the end of the year by more than a week
      if (currentDate.getFullYear() > year && currentDate.getMonth() > 0) {
        break;
      }
    }
    
    return weeks;
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeks = generateCalendarGrid();
  const totalHours = Object.values(calendarData).reduce((sum, hours) => sum + hours, 0);
  const activeDays = Object.values(calendarData).filter(hours => hours > 0).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-black/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Deep Work Contribution Calendar</h2>
            <p className="text-white/60 mt-1">
              Your deep work hours throughout the year. Darker cells indicate more hours of focused work.
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-white/60 px-12">
            {months.map(month => (
              <span key={month} className="text-center">{month}</span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex gap-2">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-white/60 justify-between py-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-53 gap-1">
              {weeks.map((week, weekIndex) => 
                week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${
                      day.level === 0 ? 'bg-gray-800' :
                      day.level === 1 ? 'bg-blue-900' :
                      day.level === 2 ? 'bg-blue-700' :
                      day.level === 3 ? 'bg-blue-500' :
                      'bg-blue-400'
                    } ${!day.isCurrentYear ? 'opacity-30' : ''}`}
                    title={`${day.date.toLocaleDateString()}: ${day.hours} hours`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-800" />
                <div className="w-3 h-3 rounded-sm bg-blue-900" />
                <div className="w-3 h-3 rounded-sm bg-blue-700" />
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <div className="w-3 h-3 rounded-sm bg-blue-400" />
              </div>
              <span>More</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-400" />
                <span>Deep (4+ hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-700" />
                <span>Medium (2-4 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-900" />
                <span>Light (1-2 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-900" />
                <span>Very Light (0-1 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gray-800" />
                <span>0 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}