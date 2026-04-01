import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Menu } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'DASH', icon: LayoutDashboard },
  { path: '/transactions', label: 'TXNS', icon: ArrowLeftRight },
  { path: '/insights', label: 'STATS', icon: TrendingUp },
];

export function Sidebar() {
  const location = useLocation();
  const { state } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r-2 border-foreground/20 bg-sidebar transition-all duration-200",
          collapsed ? "w-16" : "w-48"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 label-uppercase text-left hover:text-accent transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/10 text-foreground/70"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex items-center gap-1">
                    {item.label}
                    {active && <span className="animate-blink-cursor text-accent">▮</span>}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t-2 border-foreground/20">
          <div className={cn("text-[10px] text-muted-foreground uppercase tracking-widest", collapsed && "text-center")}>
            {collapsed ? (state.role === 'admin' ? 'ADM' : 'VWR') : `MODE: ${state.role.toUpperCase()}`}
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t-2 border-foreground/20 bg-sidebar">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors",
                active ? "text-accent" : "text-foreground/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
