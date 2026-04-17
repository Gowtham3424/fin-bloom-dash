import { Sun, Moon, User, ChevronDown } from 'lucide-react';
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useCurrency, CURRENCIES } from '@/contexts/CurrencyContext';
import { Role } from '@/types';

export function Header() {
  const { state, setRole, toggleTheme } = useApp();
  const { currency, setCurrency, rateUSDtoCurrent } = useCurrency();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const rateLabel = `1 USD = ${rateUSDtoCurrent.toLocaleString(undefined, {
    minimumFractionDigits: rateUSDtoCurrent < 10 ? 4 : 2,
    maximumFractionDigits: rateUSDtoCurrent < 10 ? 4 : 2,
  })} ${currency.code}`;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b-2 border-foreground/20 bg-card">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold tracking-[0.2em] uppercase">▣ FINBOARD</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Live FX badge */}
        {currency.code !== 'USD' && (
          <div className="hidden lg:flex items-center gap-1.5 border-2 border-foreground/20 rounded-sm px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-income animate-pulse" />
            {rateLabel}
          </div>
        )}

        {/* Currency selector */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 border-2 border-foreground/20 rounded-sm px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider hover:border-accent transition-colors"
            aria-label="Select currency"
          >
            <span className="text-sm leading-none">{currency.flag}</span>
            <span>{currency.code}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] border-2 border-foreground/20 bg-card rounded-sm shadow-lg max-h-72 overflow-y-auto">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left font-mono text-[11px] font-bold uppercase hover:bg-foreground/10 transition-colors ${
                    c.code === currency.code ? 'bg-foreground text-background' : ''
                  }`}
                >
                  <span className="text-sm leading-none">{c.flag}</span>
                  <span>{c.code}</span>
                  <span className="text-[10px] font-normal opacity-60 normal-case truncate">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div className="hidden sm:flex items-center border-2 border-foreground/20 rounded-sm overflow-hidden">
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
        <div className="hidden sm:flex h-8 w-8 rounded-sm border-2 border-foreground/20 items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
