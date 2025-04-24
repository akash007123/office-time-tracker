import React, { useState } from 'react';
import { ClipboardCheck, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksUpdate }) => {
  const [taskName, setTaskName] = useState<string>('');
  const [taskDuration, setTaskDuration] = useState<string>('');
  const [taskNotes, setTaskNotes] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateTask = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!taskName.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (taskDuration) {
      const durationRegex = /^([0-9][0-9]):([0-5][0-9])$/;
      if (!durationRegex.test(taskDuration)) {
        newErrors.duration = 'Please enter a valid duration format (HH:MM)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = (): void => {
    if (!validateTask()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      duration: taskDuration,
      notes: taskNotes
    };
    
    onTasksUpdate([...tasks, newTask]);
    
    // Reset form
    setTaskName('');
    setTaskDuration('');
    setTaskNotes('');
  };

  const handleDeleteTask = (id: string): void => {
    onTasksUpdate(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (task: Task): void => {
    setEditingTaskId(task.id);
    setTaskName(task.name);
    setTaskDuration(task.duration);
    setTaskNotes(task.notes);
  };

  const handleUpdateTask = (): void => {
    if (!validateTask() || !editingTaskId) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          name: taskName,
          duration: taskDuration,
          notes: taskNotes
        };
      }
      return task;
    });
    
    onTasksUpdate(updatedTasks);
    
    // Reset form and editing state
    setTaskName('');
    setTaskDuration('');
    setTaskNotes('');
    setEditingTaskId(null);
  };

  const handleCancelEdit = (): void => {
    setTaskName('');
    setTaskDuration('');
    setTaskNotes('');
    setEditingTaskId(null);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tasks Worked On</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What did you work on?"
            className={`block w-full px-3 py-2 border ${
              errors.name ? 'border-error-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-500">{errors.name}</p>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Optional)
            </label>
            <input
              type="text"
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
              placeholder="e.g., 01:30"
              className={`block w-full px-3 py-2 border ${
                errors.duration ? 'border-error-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-error-500">{errors.duration}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Any additional details"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          {editingTaskId ? (
            <div className="space-x-2">
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
              >
                <Check className="h-4 w-4 mr-1" />
                Update Task
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Task
            </button>
          )}
        </div>
      </div>
      
      {tasks.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Task List</h3>
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <ClipboardCheck className="h-5 w-5 text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-900">{task.name}</p>
                      {task.duration && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                          {task.duration}
                        </span>
                      )}
                    </div>
                    {task.notes && (
                      <p className="mt-1 text-sm text-gray-500 ml-7">{task.notes}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="mr-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-error-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add tasks you've worked on during the day
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;