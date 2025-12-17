import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  Users,
  X,
  Plus,
  Filter,
  Grid3x3,
} from 'lucide-react';
import { mockEvents, categories } from '../../lib/mockData';
import { useEvents } from '../../contexts/EventsContext';
import { EventFilters, ViewMode } from '../../lib/types';
import { EventCard } from '../events/EventCard';
import { EmptyState } from '../events/EmptyState';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';

interface EventsPageProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export function EventsPage({ onNavigate }: EventsPageProps) {
  const { isAuthenticated } = useAuth();
  const { events } = useEvents();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: 'All Categories',
    availability: 'all',
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'All Categories' || event.category === filters.category;

      const seatsLeft = event.capacity - event.attending;
      const matchesAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'open' && seatsLeft > 0) ||
        (filters.availability === 'full' && seatsLeft === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [events, filters]);

  const activeFiltersCount = [
    filters.category !== 'All Categories',
    filters.availability !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      availability: 'all',
    });
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else {
      onNavigate('create-event');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl mb-2">Discover Events</h1>
            <p className="text-muted-foreground">
              Find and join amazing events happening near you
            </p>
          </div>
          <Button size="lg" onClick={handleCreateEvent} className="group">
            <Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform" />
            Create Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title, description, or location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="mr-2 size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 size-5 p-0 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="border rounded-lg p-1 flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3x3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className={`${showFilters ? 'flex' : 'hidden md:flex'} flex-col md:flex-row gap-4`}>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.availability} onValueChange={(value: any) => setFilters({ ...filters, availability: value })}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="open">Available</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 size-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={(id) => onNavigate('event-details', id)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type={filters.search || activeFiltersCount > 0 ? 'no-results' : 'no-events'}
            onAction={filters.search || activeFiltersCount > 0 ? clearFilters : handleCreateEvent}
          />
        )}
      </div>
    </div>
  );
}