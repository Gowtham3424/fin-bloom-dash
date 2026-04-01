import { Sun, Moon, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Role } from '@/types';

export function Header() {
  const { state, setRole, toggleTheme } = useApp();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b-2 border-foreground/20 bg-card">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold tracking-[0.2em] uppercase">▣ FINBOARD</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <div className="flex items-center border-2 border-foreground/20 rounded-sm overflow-hidden">
          {(['viewer', 'admin'] as Role[]).map(role => (
            <button
              key={role}
              onClick={() => setRole(role)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                state.role === role
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-tactile p-2 rounded-sm hover:bg-foreground/10 transition-colors"
          aria-label="Toggle theme"
        >
          {state.theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* User avatar placeholder */}
        <div className="h-8 w-8 rounded-sm border-2 border-foreground/20 flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
