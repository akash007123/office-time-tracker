import React from 'react';
import { Clock, History } from 'lucide-react';

interface HeaderProps {
  activeView: 'tracker' | 'history';
  onViewChange: (view: 'tracker' | 'history') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-primary-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Office Time Tracker</h1>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => onViewChange('tracker')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'tracker'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150`}
            >
              <Clock className="h-4 w-4 inline mr-1" />
              Tracker
            </button>
            <button
              onClick={() => onViewChange('history')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'history'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors duration-150`}
            >
              <History className="h-4 w-4 inline mr-1" />
              History
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;