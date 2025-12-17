import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Event } from '../../lib/types';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
  viewMode?: 'grid' | 'list';
}

export function EventCard({ event, onViewDetails, viewMode = 'grid' }: EventCardProps) {
  const attendancePercentage = (event.attending / event.capacity) * 100;
  const seatsLeft = event.capacity - event.attending;
  const isFull = seatsLeft === 0;
  const isAlmostFull = seatsLeft > 0 && attendancePercentage >= 80;

  const getAvailabilityColor = () => {
    if (isFull) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (isAlmostFull) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-success/10 text-success border-success/20';
  };

  const getAvailabilityText = () => {
    if (isFull) return 'Full';
    if (isAlmostFull) return `${seatsLeft} left`;
    return 'Available';
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="flex flex-col md:flex-row" onClick={() => onViewDetails(event.id)}>
          <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <Badge className={`absolute top-2 right-2 ${getAvailabilityColor()}`}>
              {getAvailabilityText()}
            </Badge>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <h3 className="text-xl mb-2">{event.title}</h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>{event.attending} / {event.capacity}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span>{attendancePercentage.toFixed(0)}% filled</span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
      <div onClick={() => onViewDetails(event.id)}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={`absolute top-3 right-3 ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </Badge>
          <Badge variant="secondary" className="absolute top-3 left-3">
            {event.category}
          </Badge>
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="text-lg mb-2 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <Clock className="size-4 ml-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>{event.attending} / {event.capacity}</span>
              </div>
              <span className="text-muted-foreground">{attendancePercentage.toFixed(0)}% filled</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5">
          <Button className="w-full" onClick={() => onViewDetails(event.id)}>
            View Details
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
