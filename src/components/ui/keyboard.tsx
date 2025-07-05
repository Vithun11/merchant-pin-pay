import React from "react";
import { Button } from "@/components/ui/button";
import { Delete, Space } from "lucide-react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear?: () => void;
  layout?: 'qwerty' | 'alphabetical';
}

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onClear,
  layout = 'qwerty'
}) => {
  const qwertyLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const alphabeticalLayout = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
    ['T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  ];

  const keyLayout = layout === 'qwerty' ? qwertyLayout : alphabeticalLayout;

  return (
    <div className="bg-gradient-card border border-border/50 rounded-2xl p-4 space-y-3 shadow-neon">
      {keyLayout.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex justify-center gap-2 ${
            rowIndex === 1 ? 'px-4' : rowIndex === 2 ? 'px-8' : ''
          }`}
        >
          {row.map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => onKeyPress(key)}
              className="h-10 w-10 text-sm font-medium bg-gradient-cyber border-accent/30 hover:bg-gradient-primary hover:border-primary/50 hover:text-primary-foreground hover:shadow-neon transition-glow"
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
      
      {/* Bottom row with space, backspace, and clear */}
      <div className="flex justify-center gap-2 pt-2">
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-10 px-4 text-xs font-medium bg-gradient-cyber border-accent/30 hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive transition-glow"
          >
            Clear
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSpace}
          className="h-10 px-8 text-xs font-medium bg-gradient-cyber border-accent/30 hover:bg-gradient-primary hover:border-primary/50 hover:text-primary-foreground hover:shadow-neon transition-glow flex items-center gap-2"
        >
          <Space className="w-3 h-3" />
          Space
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBackspace}
          className="h-10 px-4 text-xs font-medium bg-gradient-cyber border-accent/30 hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive transition-glow"
        >
          <Delete className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};