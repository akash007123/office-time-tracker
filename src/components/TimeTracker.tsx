import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Utensils } from 'lucide-react';
import { TimeData } from '../types';
import { calculateTotalTime, formatTimeToAmPm, convertTo24HourFormat, isValidAmPmTimeFormat } from '../utils/timeUtils';

interface TimeTrackerProps {
  onTimeUpdate: (timeData: TimeData) => void;
  initialTimeData?: TimeData;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ onTimeUpdate, initialTimeData }) => {
  const [startTime, setStartTime] = useState<string>(initialTimeData?.startTime || '');
  const [endTime, setEndTime] = useState<string>(initialTimeData?.endTime || '');
  const [lunchBreak, setLunchBreak] = useState<string>(initialTimeData?.lunchBreak || '00:30');
  const [additionalBreak, setAdditionalBreak] = useState<string>(initialTimeData?.additionalBreak || '00:00');
  const [totalOfficeHours, setTotalOfficeHours] = useState<string>('00:00');
  const [totalDeskTime, setTotalDeskTime] = useState<string>('00:00');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (startTime && endTime) {
      const start24 = convertTo24HourFormat(startTime);
      const end24 = convertTo24HourFormat(endTime);
      
      // Calculate total office hours (without subtracting breaks)
      const officeHours = calculateTotalTime(start24, end24);
      setTotalOfficeHours(officeHours);
      
      // Calculate desk time (total time minus breaks)
      const deskTime = calculateTotalTime(start24, end24, lunchBreak, additionalBreak);
      setTotalDeskTime(deskTime);
      
      // Update parent component
      onTimeUpdate({
        startTime,
        endTime,
        lunchBreak,
        additionalBreak,
        totalOfficeHours: officeHours,
        totalDeskTime: deskTime
      });
    }
  }, [startTime, endTime, lunchBreak, additionalBreak, onTimeUpdate]);

  const validateTime = (field: string, value: string): boolean => {
    const newErrors = { ...errors };
    
    if (field === 'startTime' || field === 'endTime') {
      if (!isValidAmPmTimeFormat(value)) {
        newErrors[field] = 'Please enter a valid time (e.g., 10:00 AM)';
        setErrors(newErrors);
        return false;
      }
    } else {
      // For break times, validate format HH:MM
      const regex = /^([0-9][0-9]):([0-5][0-9])$/;
      if (!regex.test(value)) {
        newErrors[field] = 'Please enter a valid time format (HH:MM)';
        setErrors(newErrors);
        return false;
      }
    }
    
    // Clear error if validation passes
    delete newErrors[field];
    setErrors(newErrors);
    return true;
  };

  const handleTimeChange = (field: string, value: string): void => {
    if (value === '') {
      // Clear error if field is empty
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    } else if (field !== 'startTime' && field !== 'endTime') {
      validateTime(field, value);
    }
    
    switch (field) {
      case 'startTime':
        setStartTime(value);
        break;
      case 'endTime':
        setEndTime(value);
        break;
      case 'lunchBreak':
        setLunchBreak(value);
        break;
      case 'additionalBreak':
        setAdditionalBreak(value);
        break;
      default:
        break;
    }
  };

  const handleBlur = (field: string, value: string): void => {
    validateTime(field, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Time Tracker</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day Start Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                onBlur={(e) => handleBlur('startTime', e.target.value)}
                placeholder="e.g., 10:00 AM"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.startTime ? 'border-error-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
              />
            </div>
            {errors.startTime && (
              <p className="mt-1 text-sm text-error-500">{errors.startTime}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lunch Break
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Utensils className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={lunchBreak}
                onChange={(e) => handleTimeChange('lunchBreak', e.target.value)}
                onBlur={(e) => handleBlur('lunchBreak', e.target.value)}
                placeholder="e.g., 00:30"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.lunchBreak ? 'border-error-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
              />
            </div>
            {errors.lunchBreak && (
              <p className="mt-1 text-sm text-error-500">{errors.lunchBreak}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day End Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                onBlur={(e) => handleBlur('endTime', e.target.value)}
                placeholder="e.g., 06:00 PM"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.endTime ? 'border-error-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
              />
            </div>
            {errors.endTime && (
              <p className="mt-1 text-sm text-error-500">{errors.endTime}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Breaks
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Coffee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={additionalBreak}
                onChange={(e) => handleTimeChange('additionalBreak', e.target.value)}
                onBlur={(e) => handleBlur('additionalBreak', e.target.value)}
                placeholder="e.g., 00:15"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.additionalBreak ? 'border-error-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
              />
            </div>
            {errors.additionalBreak && (
              <p className="mt-1 text-sm text-error-500">{errors.additionalBreak}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Today's Total Office Hours</p>
            <p className="text-2xl font-bold text-primary-700">{totalOfficeHours}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Desk Time</p>
            <p className="text-2xl font-bold text-secondary-700">{totalDeskTime}</p>
          </div>
        </div>
        
        {/* Time breakdown visualization */}
        {startTime && endTime && (
          <div className="mt-4">
            <div className="h-6 w-full bg-gray-200 rounded overflow-hidden relative">
              <div 
                className="h-full bg-primary-200 absolute"
                style={{ width: '100%' }}
              ></div>
              <div 
                className="h-full bg-secondary-500 absolute"
                style={{ 
                  width: `${
                    totalOfficeHours !== '00:00' 
                      ? (parseInt(totalDeskTime.split(':')[0]) * 60 + parseInt(totalDeskTime.split(':')[1])) / 
                        (parseInt(totalOfficeHours.split(':')[0]) * 60 + parseInt(totalOfficeHours.split(':')[1])) * 100
                      : 0
                  }%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{startTime}</span>
              <span>{endTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;