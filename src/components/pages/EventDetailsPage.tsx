import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  UserCheck,
  UserX,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { mockEvents } from '../../lib/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventsContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface EventDetailsPageProps {
  eventId: string;
  onNavigate: (page: string) => void;
}

export function EventDetailsPage({ eventId, onNavigate }: EventDetailsPageProps) {
  const { user, isAuthenticated } = useAuth();
  const { events, attendingEvents, rsvpToEvent, cancelRsvp } = useEvents();
  const event = events.find((e) => e.id === eventId);
  const isAttending = attendingEvents.includes(eventId);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => onNavigate('events')} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back to Events
        </Button>
        <div className="text-center py-16">
          <h2 className="text-2xl mb-2">Event not found</h2>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const attendancePercentage = (event.attending / event.capacity) * 100;
  const seatsLeft = event.capacity - event.attending;
  const isFull = seatsLeft === 0;

  const handleRSVP = async () => {
    if (!isAuthenticated) {
      toast.error('Authentication required', {
        description: 'Please sign in to RSVP for events.',
      });
      onNavigate('login');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isAttending) {
      cancelRsvp(eventId);
      toast.success('RSVP cancelled', {
        description: 'You have successfully left this event.',
      });
    } else {
      if (isFull) {
        toast.error('Event is full', {
          description: 'This event has reached maximum capacity.',
        });
      } else {
        rsvpToEvent(eventId);
        toast.success('RSVP confirmed!', {
          description: 'You have successfully joined this event.',
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => onNavigate('events')} className="mb-6">
          <ArrowLeft className="mr-2 size-4" />
          Back to Events
        </Button>

        {/* Banner Image */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge className={isFull ? 'bg-destructive' : 'bg-success'}>
                {isFull ? 'Full' : `${seatsLeft} seats left`}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-5" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p>{event.capacity} attendees maximum</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concurrency Notice */}
            <Alert>
              <Shield className="size-4" />
              <AlertDescription>
                Seat availability updates in real-time using atomic operations to prevent
                overbooking, even under high concurrent load.
              </AlertDescription>
            </Alert>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>RSVP Status</CardTitle>
                <CardDescription>
                  {event.attending} / {event.capacity} seats filled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span>{attendancePercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={attendancePercentage} className="h-3" />
                  <p className="text-sm text-muted-foreground text-center">
                    {isFull ? (
                      <span className="text-destructive">Event is at full capacity</span>
                    ) : (
                      <span className="text-success">{seatsLeft} seats remaining</span>
                    )}
                  </p>
                </div>

                {/* RSVP Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleRSVP}
                          disabled={loading || (isFull && !isAttending)}
                          variant={isAttending ? 'outline' : 'default'}
                        >
                          {loading ? (
                            'Processing...'
                          ) : isAttending ? (
                            <>
                              <UserX className="mr-2 size-4" />
                              Leave Event
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 size-4" />
                              {isFull ? 'Event Full' : 'Join Event'}
                            </>
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {isFull && !isAttending && (
                      <TooltipContent>
                        <p>This event has reached maximum capacity</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                {isAttending && (
                  <Alert className="bg-success/10 border-success/20">
                    <UserCheck className="size-4 text-success" />
                    <AlertDescription className="text-success">
                      You're attending this event!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Organizer Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={event.organizerAvatar} />
                    <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{event.organizerName}</p>
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm">Secure Event Platform</p>
                    <p className="text-xs text-muted-foreground">
                      JWT Auth • Protected Routes • Race-Condition Safe
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}