import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  onClose?: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose, variant, children, className, style, ...props }) => {
  const alertType = variant ?? type ?? 'info';
  const icons = {
    success: '✔',
    error: 'x',
    warning: '!',
    info: 'i',
  } as const;

  return (
    <div className={`alert alert-${alertType} ${className ?? ''}`.trim()} style={style} {...props}>
      <div className="alert-content">
        <span className="alert-icon">{icons[alertType]}</span>
        <div className="alert-message">
          {title && <strong className="alert-title">{title}</strong>}
          {message ? <p className="alert-text">{message}</p> : children}
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} type="button">
          x
        </button>
      )}
    </div>
  );
};

export default Alert;
