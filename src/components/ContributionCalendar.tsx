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
    
    while (currentDate <= endDate) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl glass-panel border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white">Deep Work Contribution Calendar</CardTitle>
            <p className="text-white/70 mt-1">
              Your deep work hours throughout the year. Darker cells indicate more hours of focused work.
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="flex gap-6 text-sm text-white/70">
            <div>
              <span className="text-primary font-semibold">{totalHours}</span> total hours
            </div>
            <div>
              <span className="text-primary font-semibold">{activeDays}</span> active days
            </div>
            <div>
              <span className="text-primary font-semibold">{getCurrentYear()}</span> progress
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-white/60 mb-2">
              {months.map(month => (
                <span key={month} className="w-8 text-center">{month}</span>
              ))}
            </div>

            {/* Day labels + Calendar */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 text-xs text-white/60 mr-2">
                <div className="h-3"></div> {/* Spacer for month row */}
                {days.map(day => (
                  <div key={day} className="h-3 flex items-center text-right">
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
                      className={`calendar-cell calendar-level-${day.level} ${
                        !day.isCurrentYear ? 'opacity-30' : ''
                      }`}
                      title={`${day.date.toLocaleDateString()}: ${day.hours} hours`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`calendar-cell calendar-level-${level}`} />
                ))}
              </div>
              <span>More</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <div className="calendar-cell calendar-level-1" />
                <span>Very Light (0-1 hours)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="calendar-cell calendar-level-2" />
                <span>Light (1-2 hours)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="calendar-cell calendar-level-3" />
                <span>Medium (2-4 hours)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="calendar-cell calendar-level-4" />
                <span>Deep (4+ hours)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}