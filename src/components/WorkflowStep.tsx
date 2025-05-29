import React from 'react';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';

interface WorkflowStepProps {
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  current: boolean;
  onClick?: () => void;
  stepNumber: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  title,
  description,
  status,
  current,
  onClick,
  stepNumber,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-white" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-white animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <span className="text-white font-medium">{stepNumber}</span>;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'loading':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return current ? 'bg-primary-600' : 'bg-neutral-400';
    }
  };

  return (
    <div 
      className={`flex items-start mb-4 ${onClick && status !== 'pending' ? 'cursor-pointer' : ''}`}
      onClick={status !== 'pending' ? onClick : undefined}
    >
      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      <div className="ml-3">
        <h3 className={`text-lg font-medium ${current ? 'text-primary-700' : 'text-neutral-700'}`}>{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
};

export default WorkflowStep;