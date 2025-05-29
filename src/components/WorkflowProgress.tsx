import React from 'react';
import WorkflowStep from './WorkflowStep';
import { WorkflowStep as WorkflowStepType } from '../types';

interface WorkflowProgressProps {
  steps: WorkflowStepType[];
  currentStep: number;
  onViewResult: (stepId: number) => void;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  steps,
  currentStep,
  onViewResult,
}) => {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary-800">Campaign Analysis Progress</h2>
        <div className="text-sm text-neutral-600">
          {completedSteps}/{steps.length} steps ({progress}% complete)
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-neutral-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <WorkflowStep
            key={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            current={currentStep === step.id}
            onClick={step.status === 'completed' ? () => onViewResult(step.id) : undefined}
            stepNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;