import React from 'react';

type AlertProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
};

import './styles.css'

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert alert-success';
      case 'error':
        return 'alert alert-error';
      case 'warning':
        return 'alert alert-warning';
      case 'info':
        return 'alert alert-info';
      default:
        return '';
    }
  };

  return (
    <div className={`${getAlertClass()} flex justify-between items-center gap-2`}>
      {message} <button onClick={() => {
        onClose ? onClose() : null
      }} className="close fw-bold">x</button>
    </div>
  );
};


export default Alert;