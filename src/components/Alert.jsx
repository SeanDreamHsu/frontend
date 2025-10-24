import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const styleConfig = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', Icon: AlertTriangle },
  error: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', Icon: XCircle },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', Icon: CheckCircle },
};

const Alert = ({ type, message }) => {
  const { bg, border, text, Icon } = styleConfig[type] || styleConfig.warning;
  if (!message) return null;

  return (
    <div className={`${bg} border ${border} ${text} p-4 rounded-xl shadow-sm`} role="alert">
      <div className="flex">
        <div className="py-1">
          <Icon className="h-5 w-5 mr-3" />
        </div>
        <div>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
