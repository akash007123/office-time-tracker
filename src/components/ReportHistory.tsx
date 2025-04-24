import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { DailyReport } from '../types';
import { format, parseISO } from 'date-fns';

interface ReportHistoryProps {
  reports: DailyReport[];
  onSelectReport: (report: DailyReport) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ reports, onSelectReport }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report History</h2>
      
      {reports.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <li key={index}>
              <button
                onClick={() => onSelectReport(report)}
                className="w-full flex items-center justify-between py-4 hover:bg-gray-50 transition-colors duration-150 px-3 rounded-md"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {format(parseISO(report.date), 'MMMM d, yyyy')}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{report.timeData.totalOfficeHours} office hours</span>
                      <span className="mx-1">•</span>
                      <span>{report.tasks.length} tasks</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your saved reports will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;