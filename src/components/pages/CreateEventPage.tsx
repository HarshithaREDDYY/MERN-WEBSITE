import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Save,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { categories } from '../../lib/mockData';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';

interface CreateEventPageProps {
  eventId?: string;
  onNavigate: (page: string) => void;
}

export function CreateEventPage({ eventId, onNavigate }: CreateEventPageProps) {
  const { createEvent, updateEvent } = useEvents();
  const { user } = useAuth();
  const isEditing = !!eventId;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState(0);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });

    if (field === 'description') {
      setCharCount(value.length);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (formData.description.length < 50)
        newErrors.description = 'Description must be at least 50 characters';
      if (!formData.category) newErrors.category = 'Category is required';
    }

    if (step === 2) {
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.time) newErrors.time = 'Time is required';
      if (!formData.location) newErrors.location = 'Location is required';
    }

    if (step === 3) {
      if (!formData.capacity) newErrors.capacity = 'Capacity is required';
      const cap = parseInt(formData.capacity);
      if (isNaN(cap) || cap < 1) newErrors.capacity = 'Capacity must be at least 1';
      if (cap > 100000) newErrors.capacity = 'Capacity cannot exceed 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleEnhance = () => {
    toast.info('AI Enhancement', {
      description: 'AI-powered description enhancement is a premium feature.',
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isEditing) {
      updateEvent(eventId, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      });
      toast.success('Event updated!', {
        description: 'Your event has been successfully updated.',
      });
    } else {
      createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        organizerId: user?.id || 'user-1',
        organizerName: user?.name || 'Current User',
        organizerAvatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      });
      toast.success('Event created!', {
        description: 'Your event has been created and is now live.',
      });
    }

    setLoading(false);
    onNavigate('dashboard');
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Date & Location', icon: MapPin },
    { number: 3, title: 'Capacity & Image', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Button variant="ghost" onClick={() => onNavigate('events')} className="mb-6">
          <ArrowLeft className="mr-2 size-4" />
          Cancel
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl mb-2">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to {isEditing ? 'update' : 'create'} your event
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                          ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                              : isCompleted
                              ? 'bg-success text-white'
                              : 'bg-muted text-muted-foreground'
                          }
                        `}
                      >
                        <Icon className="size-5" />
                      </div>
                      <p className={`text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-4 mb-8 rounded-full transition-all ${
                          isCompleted ? 'bg-success' : 'bg-muted'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-2">Basic Information</CardTitle>
                    <CardDescription>
                      Tell us about your event and what makes it special
                    </CardDescription>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., React Summit 2025"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEnhance}
                        className="text-xs"
                      >
                        <Sparkles className="mr-1 size-3" />
                        AI Enhance
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your event in detail. What will attendees experience? What should they expect?"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={6}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{errors.description || 'Minimum 50 characters'}</span>
                      <span className={charCount < 50 ? 'text-destructive' : 'text-success'}>
                        {charCount} / 500
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== 'All Categories').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-2">Date & Location</CardTitle>
                    <CardDescription>When and where will your event take place?</CardDescription>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateField('date', e.target.value)}
                          className="pl-9"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Event Time *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => updateField('time', e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA or Virtual Event"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Capacity & Image */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-2">Capacity & Media</CardTitle>
                    <CardDescription>Set attendance limits and add event imagery</CardDescription>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Maximum Capacity *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="e.g., 100"
                        value={formData.capacity}
                        onChange={(e) => updateField('capacity', e.target.value)}
                        className="pl-9"
                        min="1"
                        max="100000"
                      />
                    </div>
                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                    <p className="text-xs text-muted-foreground">
                      Maximum number of attendees allowed for this event
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Event Image URL (Optional)</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="image"
                        type="url"
                        placeholder="https://example.com/event-image.jpg"
                        value={formData.image}
                        onChange={(e) => updateField('image', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add a banner image to make your event stand out
                    </p>
                  </div>

                  {/* Preview */}
                  {formData.image && (
                    <div className="space-y-2">
                      <Label>Image Preview</Label>
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={formData.image}
                          alt="Event preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Next Step
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={loading}>
                    <Save className="mr-2 size-4" />
                    {loading ? 'Creating...' : isEditing ? 'Update Event' : 'Create Event'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}