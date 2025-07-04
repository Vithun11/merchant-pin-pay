import React from "react";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Step {currentStep} of {totalSteps}</span>
        <span className="text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${isCompleted 
                  ? 'bg-success text-success-foreground' 
                  : isCurrent 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' 
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <span className={`text-xs text-center max-w-[80px] ${
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};