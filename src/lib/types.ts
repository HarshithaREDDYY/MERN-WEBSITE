export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  attending: number;
  image: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  attendees: string[];
}

export interface EventFilters {
  search: string;
  category: string;
  availability: 'all' | 'open' | 'full';
  dateFrom?: string;
  dateTo?: string;
}

export type ViewMode = 'grid' | 'list';

export interface UserStats {
  eventsCreated: number;
  totalRSVPs: number;
  upcomingEvents: number;
}
