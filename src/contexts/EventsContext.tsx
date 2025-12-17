import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../lib/types';
import { mockEvents } from '../lib/mockData';

interface EventsContextType {
  events: Event[];
  createdEvents: Event[];
  attendingEvents: string[];
  createEvent: (event: Omit<Event, 'id' | 'attending' | 'attendees'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpToEvent: (eventId: string, userId: string) => void;
  cancelRsvp: (eventId: string, userId: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    const storedAttending = localStorage.getItem('attendingEvents');
    
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Initialize with mock events
      setEvents(mockEvents);
      localStorage.setItem('events', JSON.stringify(mockEvents));
    }

    if (storedAttending) {
      setAttendingEvents(JSON.parse(storedAttending));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  // Save attending events to localStorage
  useEffect(() => {
    localStorage.setItem('attendingEvents', JSON.stringify(attendingEvents));
  }, [attendingEvents]);

  const createEvent = (eventData: Omit<Event, 'id' | 'attending' | 'attendees'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attending: 0,
      attendees: [],
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...eventData } : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const rsvpToEvent = (eventId: string, userId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId && event.attending < event.capacity) {
          return {
            ...event,
            attending: event.attending + 1,
            attendees: [...event.attendees, userId],
          };
        }
        return event;
      })
    );
    setAttendingEvents((prev) => [...prev, eventId]);
  };

  const cancelRsvp = (eventId: string, userId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attending: Math.max(0, event.attending - 1),
            attendees: event.attendees.filter((id) => id !== userId),
          };
        }
        return event;
      })
    );
    setAttendingEvents((prev) => prev.filter((id) => id !== eventId));
  };

  // Get events created by the current user (using organizerId)
  const createdEvents = events.filter((event) => {
    // In a real app, this would check against the actual user ID
    // For now, we'll check if the event was created after app initialization
    return event.id.startsWith('event-');
  });

  return (
    <EventsContext.Provider
      value={{
        events,
        createdEvents,
        attendingEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        rsvpToEvent,
        cancelRsvp,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}
