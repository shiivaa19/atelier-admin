import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load product data",
  message = "An error occurred while connecting to the DummyJSON API. Please try again.",
  onRetry,
}) => {
  return (
    <div className="p-8 text-center rounded-2xl bg-red-950/20 border border-red-800/40 flex flex-col items-center justify-center my-6 max-w-md mx-auto animate-fadeIn">
      <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/50 flex items-center justify-center mb-3 text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-200 mb-1">{title}</h3>
      <p className="text-xs text-red-300/80 leading-relaxed mb-5 max-w-xs">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
