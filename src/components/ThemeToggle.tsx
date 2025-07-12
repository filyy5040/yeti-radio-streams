
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:bg-accent transition-all duration-300 hover:scale-110 group"
      aria-label={`Passa al tema ${theme === 'dark' ? 'chiaro' : 'scuro'}`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`w-6 h-6 absolute transition-all duration-500 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon 
          className={`w-6 h-6 absolute transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};
