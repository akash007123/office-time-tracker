import { DailyReport } from '../types';

const STORAGE_KEY = 'office-time-tracker-reports';

/**
 * Saves a daily report to local storage
 */
export const saveDailyReport = (report: DailyReport): void => {
  try {
    // Get existing reports
    const reports = getReports();
    
    // Add new report
    reports.push(report);
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving report:', error);
  }
};

/**
 * Gets all reports from local storage
 */
export const getReports = (): DailyReport[] => {
  try {
    const reportsJson = localStorage.getItem(STORAGE_KEY);
    return reportsJson ? JSON.parse(reportsJson) : [];
  } catch (error) {
    console.error('Error retrieving reports:', error);
    return [];
  }
};

/**
 * Gets the most recent report from local storage
 */
export const getLatestReport = (): DailyReport | null => {
  const reports = getReports();
  return reports.length > 0 ? reports[reports.length - 1] : null;
};

/**
 * Clears all reports from local storage
 */
export const clearReports = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};