import React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-4 w-full", className)}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <button
            type="button"
            className={cn(
              "flex flex-col items-center focus:outline-none",
              idx <= currentStep
                ? "text-primary"
                : "text-muted-foreground cursor-default"
            )}
            onClick={() => onStepChange && onStepChange(idx)}
            disabled={!onStepChange || idx > currentStep}
          >
            <div
              className={cn(
                "rounded-full border-2 flex items-center justify-center w-8 h-8 mb-1",
                idx === currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : idx < currentStep
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background"
              )}
            >
              {idx + 1}
            </div>
            <span className="text-xs font-medium">{step.label}</span>
            {step.description && (
              <span className="text-[10px] text-muted-foreground">
                {step.description}
              </span>
            )}
          </button>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-border mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
