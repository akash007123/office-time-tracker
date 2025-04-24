import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileDown, Save, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DailyReport as DailyReportType } from '../types';
import { saveDailyReport } from '../utils/storageUtils';

interface DailyReportProps {
  timeData: DailyReportType['timeData'];
  tasks: DailyReportType['tasks'];
}

const DailyReport: React.FC<DailyReportProps> = ({ timeData, tasks }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Daily Report - ${format(new Date(), 'yyyy-MM-dd')}`,
  });
  
  const handleSave = () => {
    const report: DailyReportType = {
      date: format(new Date(), 'yyyy-MM-dd'),
      timeData,
      tasks
    };
    
    saveDailyReport(report);
    
    // Show notification (could be improved with a proper toast notification)
    alert('Report saved successfully!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daily Report</h2>
      
      <div
        ref={reportRef}
        className="p-4 bg-white rounded-lg"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            Daily Work Report
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Time Summary</h4>
          <div className="">
            <div className="bg-gray-50 p-3 rounded-lg flex gap-5">
              <p className="text-xs text-gray-700">Day Start Time:</p>
              <p className="text-xs">{timeData.startTime || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex gap-5">
              <p className="text-xs text-gray-500">Day End Time</p>
              <p className="text-xs">{timeData.endTime || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex gap-5">
              <p className="text-xs text-gray-500">Total Working Hours Today:</p>
              <p className="text-xs">{timeData.totalOfficeHours || '00:00'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded- flex gap-5">
              <p className="text-xs text-gray-500">Today's Hours at Desk:</p>
              <p className="text-xs">{timeData.totalDeskTime || '00:00'}</p>
            </div>
          </div>
          
          <div className="">
            <div className="bg-gray-50 p-3 rounded-lg flex gap-5">
              <p className="text-xs text-gray-500">Lunch Break</p>
              <p className="text-xs">{timeData.lunchBreak || '00:00'} min.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex gap-5">
              <p className="text-xs text-gray-500">Additional Breaks</p>
              <p className="text-xs">{timeData.additionalBreak || '00:00'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Tasks Completed</h4>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{task.duration || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{task.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No tasks recorded for today</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors duration-200"
        >
          <Save className="h-4 w-4 mr-1" />
          Save to Browser
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <FileDown className="h-4 w-4 mr-1" />
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default DailyReport;