import React, { useState, useEffect } from 'react';
import TimeTracker from './components/TimeTracker';
import TaskManager from './components/TaskManager';
import DailyReport from './components/DailyReport';
import ReportHistory from './components/ReportHistory';
import Header from './components/Header';
import { Task, TimeData, DailyReport as DailyReportType } from './types';
import { getReports, getLatestReport } from './utils/storageUtils';

function App() {
  const [timeData, setTimeData] = useState<TimeData>({
    startTime: '',
    endTime: '',
    lunchBreak: '00:30',
    additionalBreak: '00:00',
    totalOfficeHours: '00:00',
    totalDeskTime: '00:00'
  });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState<'tracker' | 'history'>('tracker');
  const [reports, setReports] = useState<DailyReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReportType | null>(null);

  // Load reports from local storage
  useEffect(() => {
    const savedReports = getReports();
    setReports(savedReports);
  }, []);

  const handleTimeUpdate = (newTimeData: TimeData) => {
    setTimeData(newTimeData);
  };

  const handleTasksUpdate = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const handleSelectReport = (report: DailyReportType) => {
    setSelectedReport(report);
    setTimeData(report.timeData);
    setTasks(report.tasks);
    setActiveView('tracker');
  };

  const handleViewChange = (view: 'tracker' | 'history') => {
    if (view === 'history') {
      // Refresh reports when viewing history
      setReports(getReports());
      setSelectedReport(null);
    } else if (!selectedReport) {
      // When going back to tracker without a selected report, reset to current state
      const latestReport = getLatestReport();
      if (latestReport) {
        setTimeData(latestReport.timeData);
        setTasks(latestReport.tasks);
      }
    }
    
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeView={activeView} onViewChange={handleViewChange} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeView === 'tracker' ? (
          <div className="px-4 sm:px-0">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <TimeTracker 
                onTimeUpdate={handleTimeUpdate} 
                initialTimeData={timeData}
              />
              <TaskManager 
                tasks={tasks} 
                onTasksUpdate={handleTasksUpdate} 
              />
            </div>
            
            <div className="mt-6">
              <DailyReport 
                timeData={timeData} 
                tasks={tasks} 
              />
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-0">
            <ReportHistory 
              reports={reports} 
              onSelectReport={handleSelectReport} 
            />
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Office Time Tracker © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;