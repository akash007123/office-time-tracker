export interface Task {
  id: string;
  name: string;
  duration: string;
  notes: string;
}

export interface TimeData {
  startTime: string;
  endTime: string;
  lunchBreak: string;
  additionalBreak: string;
  totalOfficeHours: string;
  totalDeskTime: string;
}

export interface DailyReport {
  date: string;
  timeData: TimeData;
  tasks: Task[];
}