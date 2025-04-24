import { format, parse, differenceInMinutes, addMinutes } from 'date-fns';

/**
 * Formats time from 24-hour format to 12-hour format with AM/PM
 */
export const formatTimeToAmPm = (time: string): string => {
  if (!time) return '';
  
  try {
    // Parse the time in 24-hour format
    const dateObj = parse(time, 'HH:mm', new Date());
    // Format to 12-hour format with AM/PM
    return format(dateObj, 'hh:mm a');
  } catch (error) {
    return time;
  }
};

/**
 * Converts time from 12-hour format to 24-hour format
 */
export const convertTo24HourFormat = (time: string): string => {
  if (!time) return '';
  
  try {
    // Parse the time in 12-hour format
    const dateObj = parse(time, 'hh:mm a', new Date());
    // Format to 24-hour format
    return format(dateObj, 'HH:mm');
  } catch (error) {
    return time;
  }
};

/**
 * Calculates the total time in hours and minutes between two times, considering breaks
 */
export const calculateTotalTime = (
  startTime: string,
  endTime: string,
  lunchBreak: string = '00:00',
  additionalBreak: string = '00:00'
): string => {
  if (!startTime || !endTime) return '00:00';

  try {
    // Parse start and end times to Date objects
    const today = new Date();
    const startDate = parse(startTime, 'HH:mm', today);
    let endDate = parse(endTime, 'HH:mm', today);
    
    // If end time is earlier than start time, assume it's the next day
    if (endDate < startDate) {
      endDate = addMinutes(endDate, 24 * 60); // Add 24 hours
    }
    
    // Calculate total minutes
    const totalMinutes = differenceInMinutes(endDate, startDate);
    
    // Parse break times
    const lunchBreakMinutes = parseBreakTime(lunchBreak);
    const additionalBreakMinutes = parseBreakTime(additionalBreak);
    
    // Calculate total hours and minutes after subtracting breaks
    const netMinutes = totalMinutes - lunchBreakMinutes - additionalBreakMinutes;
    
    if (netMinutes < 0) return '00:00';
    
    const hours = Math.floor(netMinutes / 60);
    const minutes = netMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    return '00:00';
  }
};

/**
 * Parses break time in format "HH:MM" to minutes
 */
export const parseBreakTime = (breakTime: string): number => {
  if (!breakTime) return 0;
  
  const [hours, minutes] = breakTime.split(':').map(Number);
  return (hours * 60) + minutes;
};

/**
 * Validates time format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(time);
};

/**
 * Validates time format (HH:MM AM/PM)
 */
export const isValidAmPmTimeFormat = (time: string): boolean => {
  const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM|am|pm)$/;
  return regex.test(time);
};

/**
 * Converts minutes to HH:MM format
 */
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};