import React from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

interface NumberPadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  maxLength?: number;
  currentValue?: string;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onBackspace,
  onClear,
  maxLength,
  currentValue = ""
}) => {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '']
  ];

  const handleNumberPress = (number: string) => {
    if (!number) return;
    if (maxLength && currentValue.length >= maxLength) return;
    onNumberPress(number);
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4 max-w-xs mx-auto">
      {numbers.flat().map((number, index) => {
        if (!number) {
          if (index === 9) {
            return onClear ? (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={onClear}
                className="h-14 text-lg font-semibold"
              >
                Clear
              </Button>
            ) : <div key={index} />;
          }
          if (index === 11) {
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={onBackspace}
                className="h-14"
              >
                <Delete className="w-5 h-5" />
              </Button>
            );
          }
          return <div key={index} />;
        }
        
        return (
          <Button
            key={index}
            variant="outline"
            size="lg"
            onClick={() => handleNumberPress(number)}
            className="h-14 text-xl font-semibold hover:bg-primary/10"
            disabled={maxLength ? currentValue.length >= maxLength : false}
          >
            {number}
          </Button>
        );
      })}
    </div>
  );
};