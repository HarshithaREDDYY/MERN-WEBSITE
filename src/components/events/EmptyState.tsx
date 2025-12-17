import React from 'react';
import { Calendar, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  type: 'no-events' | 'no-results' | 'no-created-events' | 'no-attending-events';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    'no-events': {
      icon: Calendar,
      title: 'No events yet',
      description: 'Be the first to create an amazing event and invite others to join.',
      actionLabel: 'Create Event',
    },
    'no-results': {
      icon: Search,
      title: 'No events found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.',
      actionLabel: 'Clear Filters',
    },
    'no-created-events': {
      icon: Calendar,
      title: 'You haven\'t created any events',
      description: 'Start creating events and share them with your community.',
      actionLabel: 'Create Your First Event',
    },
    'no-attending-events': {
      icon: Search,
      title: 'No events to attend',
      description: 'Browse available events and RSVP to join interesting gatherings.',
      actionLabel: 'Explore Events',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl mb-2">{config.title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {config.description}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
}
