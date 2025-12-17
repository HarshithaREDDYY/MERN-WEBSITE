import React, { useState } from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Clock,
} from 'lucide-react';
import { mockEvents } from '../../lib/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { EmptyState } from '../events/EmptyState';
import { Progress } from '../ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface UserDashboardProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user } = useAuth();
  const { createdEvents, events, attendingEvents: attendingEventIds, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState('created');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Get events the user is attending
  const myAttendingEvents = events.filter((event) => attendingEventIds.includes(event.id));

  const stats = {
    eventsCreated: createdEvents.length,
    totalRSVPs: createdEvents.reduce((sum, event) => sum + event.attending, 0),
    upcomingEvents: myAttendingEvents.length,
  };

  const handleDelete = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      toast.success('Event deleted', {
        description: 'The event has been successfully removed.',
      });
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">Manage your events and track your attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Events Created</CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{stats.eventsCreated}</div>
              <p className="text-xs text-muted-foreground">Total events organized</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total RSVPs</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{stats.totalRSVPs}</div>
              <p className="text-xs text-muted-foreground">Across all your events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Upcoming Events</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Events you're attending</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Events</CardTitle>
                <CardDescription>View and manage your created and attending events</CardDescription>
              </div>
              <Button onClick={() => onNavigate('create-event')}>
                <Plus className="mr-2 size-4" />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="created">My Created Events</TabsTrigger>
                <TabsTrigger value="attending">Events I'm Attending</TabsTrigger>
              </TabsList>

              {/* Created Events Tab */}
              <TabsContent value="created" className="space-y-4">
                {createdEvents.length > 0 ? (
                  createdEvents.map((event) => {
                    const attendancePercentage = (event.attending / event.capacity) * 100;
                    const seatsLeft = event.capacity - event.attending;

                    return (
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Event Image */}
                            <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg">{event.title}</h3>
                                    <Badge variant="outline">{event.category}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {event.description}
                                  </p>
                                </div>

                                {/* Actions Menu */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="ml-2">
                                      <MoreVertical className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onNavigate('event-details', event.id)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onNavigate('create-event', event.id)}>
                                      <Edit className="mr-2 size-4" />
                                      Edit Event
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(event.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 size-4" />
                                      Delete Event
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="size-4" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="size-4" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="size-4" />
                                  <span className="line-clamp-1">{event.location}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {event.attending} / {event.capacity} attendees
                                  </span>
                                  <span>
                                    {seatsLeft === 0 ? (
                                      <Badge className="bg-destructive">Full</Badge>
                                    ) : seatsLeft < 10 ? (
                                      <Badge className="bg-warning">{seatsLeft} left</Badge>
                                    ) : (
                                      <Badge className="bg-success">Available</Badge>
                                    )}
                                  </span>
                                </div>
                                <Progress value={attendancePercentage} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <EmptyState type="no-created-events" onAction={() => onNavigate('create-event')} />
                )}
              </TabsContent>

              {/* Attending Events Tab */}
              <TabsContent value="attending" className="space-y-4">
                {myAttendingEvents.length > 0 ? (
                  myAttendingEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate('event-details', event.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Event Image */}
                          <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg">{event.title}</h3>
                                <Badge variant="outline">{event.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="size-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className="bg-success/10 text-success border-success/20">
                                You're attending
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Organized by {event.organizerName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <EmptyState type="no-attending-events" onAction={() => onNavigate('events')} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}