import React from 'react';
import { X } from 'lucide-react';

interface AlertProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info' | 'success';
}

const getAlertStyles = (type: AlertProps['type'] = 'error') => {
  switch (type) {
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    default:
      return 'bg-red-50 border-red-200 text-red-800';
  }
};

const getCloseButtonStyles = (type: AlertProps['type'] = 'error') => {
  switch (type) {
    case 'error':
      return 'text-red-400 hover:text-red-600';
    case 'warning':
      return 'text-yellow-400 hover:text-yellow-600';
    case 'info':
      return 'text-blue-400 hover:text-blue-600';
    case 'success':
      return 'text-green-400 hover:text-green-600';
    default:
      return 'text-red-400 hover:text-red-600';
  }
};

const Alert: React.FC<AlertProps> = ({ 
  message, 
  onClose, 
  type = 'error' 
}) => {

  return (
    <div className={`mb-6 p-4 border rounded-lg ${getAlertStyles(type)}`}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 transition-colors ${getCloseButtonStyles(type)}`}
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;