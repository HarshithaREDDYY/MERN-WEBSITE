import React from 'react';
import { Calendar, Home, LayoutDashboard, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function MobileNav({ onNavigate, currentPage }: MobileNavProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'create-event', label: 'Create', icon: Plus },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
