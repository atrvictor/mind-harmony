import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  ExternalLink,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  FileEdit,
  Globe,
  X,
  Copy
} from 'lucide-react';
import { 
  getAllEventsForAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  permanentlyDeleteEvent,
  restoreEvent,
  toggleEventFeatured,
  toggleEventStatus,
  getEventsStats,
  moveEventUp,
  moveEventDown,
  duplicateEventBelow,
  type EventDB,
  type CreateEventData
} from '@/lib/eventsDB';
import { toast } from 'sonner';
import ImageInput from './image-input';

interface EventsManagementProps {
  onEventsChange?: () => void;
}

// Event form component - extracted outside to prevent re-creation on every render
function EventForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  submitText, 
  formLoading,
  onCancel 
}: { 
  formData: CreateEventData; 
  onInputChange: (field: keyof CreateEventData, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>; 
  submitText: string;
  formLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Event title"
            required
          />
        </div>
        <div>
          <ImageInput
            value={formData.image}
            onChange={(value) => onInputChange('image', value)}
            label="Event Image"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            value={formData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            placeholder="August 15th, 2025"
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => onInputChange('time', e.target.value)}
            placeholder="6:30 PM"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="Mission Bay"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            placeholder="123 Street Name, City, CA"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Event description..."
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tickets">Tickets Link</Label>
          <Input
            id="tickets"
            value={formData.get_tickets_link}
            onChange={(e) => onInputChange('get_tickets_link', e.target.value)}
            placeholder="https://eventbrite.com/..."
          />
        </div>
        <div>
          <Label htmlFor="button">Button Text</Label>
          <Input
            id="button"
            value={formData.button}
            onChange={(e) => onInputChange('button', e.target.value)}
            placeholder="Past Event, Coming Soon, etc."
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => onInputChange('featured', checked)}
        />
        <Label htmlFor="featured">Featured Event</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}

export default function AdminEventsManagement({ onEventsChange }: EventsManagementProps) {
  const [events, setEvents] = useState<EventDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
    upcoming: 0,
    past: 0
  });

  // Edit state
  const [editingEvent, setEditingEvent] = useState<EventDB | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [permanentDeleteConfirmId, setPermanentDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '',
    description: '',
    image: '',
    featured: false,
    get_tickets_link: '',
    button: '',
    status: 'draft',
  });

  const [formLoading, setFormLoading] = useState(false);

  // Load events and stats
  const loadEvents = async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        getAllEventsForAdmin(),
        getEventsStats()
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      image: '',
      featured: false,
      get_tickets_link: '',
      button: '',
    });
  };

  // Create event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await createEvent(formData);
      toast.success('Event created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setFormLoading(false);
    }
  };

  // Edit event
  const handleEditEvent = (event: EventDB) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location || '',
      address: event.address || '',
      description: event.description,
      image: event.image,
      featured: event.featured || false,
      get_tickets_link: event.get_tickets_link || '',
      button: event.button || '',
      status: event.status,
    });
    setIsEditDialogOpen(true);
  };

  // Update event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setFormLoading(true);

    try {
      await updateEvent({ id: editingEvent.id, ...formData });
      toast.success('Event updated successfully!');
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully!');
      setDeleteConfirmId(null);
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Permanently delete event
  const handlePermanentDeleteEvent = async (id: number) => {
    try {
      await permanentlyDeleteEvent(id);
      toast.success('Event permanently deleted!');
      setPermanentDeleteConfirmId(null);
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error permanently deleting event:', error);
      toast.error('Failed to permanently delete event');
    }
  };

  // Restore event
  const handleRestoreEvent = async (id: number) => {
    try {
      await restoreEvent(id);
      toast.success('Event restored successfully!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error restoring event:', error);
      toast.error('Failed to restore event');
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleEventFeatured(id);
      toast.success('Event featured status updated!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  // Toggle status (draft/published)
  const handleToggleStatus = async (id: number) => {
    try {
      await toggleEventStatus(id);
      toast.success('Event status updated!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  // Move event up
  const handleMoveEventUp = async (id: number) => {
    try {
      await moveEventUp(id);
      toast.success('Event moved up!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error moving event up:', error);
      toast.error('Failed to move event up');
    }
  };

  // Move event down
  const handleMoveEventDown = async (id: number) => {
    try {
      await moveEventDown(id);
      toast.success('Event moved down!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error moving event down:', error);
      toast.error('Failed to move event down');
    }
  };

  // Duplicate event directly below (inactive draft)
  const handleDuplicateBelow = async (id: number) => {
    try {
      await duplicateEventBelow(id);
      toast.success('Event duplicated below as inactive draft!');
      loadEvents();
      onEventsChange?.();
    } catch (error) {
      console.error('Error duplicating event:', error);
      toast.error('Failed to duplicate event');
    }
  };

  // Handle cancel for forms
  const handleCancel = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingEvent(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Manage your events, tickets, and scheduling</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleCreateEvent} 
              submitText="Create Event"
              formLoading={formLoading}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.past}</div>
            <p className="text-xs text-muted-foreground">Past</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <Card key={event.id} className={!event.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-mono">
                        #{index + 1}
                      </Badge>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      {event.featured && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!event.is_active && (
                        <Badge variant="destructive" className="text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                      <Badge 
                        variant={(event.status || 'published') === 'published' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {(event.status || 'published') === 'published' ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <FileEdit className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                      {event.button && (
                        <Badge variant="outline" className="text-xs">
                          {event.button}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date} • {event.time}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    )}
                  </CardDescription>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Order Control Buttons - Made more visible */}
                  <div className="flex flex-col gap-1 mr-3 p-1 bg-gray-50 rounded">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 border-2 border-blue-300 hover:bg-blue-50"
                      onClick={() => handleMoveEventUp(event.id)}
                      disabled={events.findIndex(e => e.id === event.id) === 0}
                      title="Move up"
                    >
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 border-2 border-blue-300 hover:bg-blue-50"
                      onClick={() => handleMoveEventDown(event.id)}
                      disabled={events.findIndex(e => e.id === event.id) === events.length - 1}
                      title="Move down"
                    >
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(event.id)}
                    title="Toggle featured"
                  >
                    <Star className={`w-4 h-4 ${event.featured ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                  
                  {/* Draft/Publish Toggle */}
                   <Button
                    variant={event.status === 'published' ? 'outline' : 'default'}
                    size="sm"
                    className={event.status === 'published' 
                      ? 'border-2 border-orange-400 hover:bg-orange-50' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                    onClick={() => handleToggleStatus(event.id)}
                    title={event.status === 'published' ? 'Move to draft' : 'Publish event'}
                  >
                    {event.status === 'draft' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <FileEdit className="w-4 h-4 text-orange-600" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                    title="Edit event"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  {/* Duplicate below */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateBelow(event.id)}
                    title="Duplicate below (inactive draft)"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  {event.is_active ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirmId(event.id)}
                      title="Delete event (make inactive)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreEvent(event.id)}
                        title="Restore event"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPermanentDeleteConfirmId(event.id)}
                        title="Permanently delete event"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {event.get_tickets_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={event.get_tickets_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No events found. Create your first event!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleUpdateEvent} 
            submitText="Update Event"
            formLoading={formLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this event? This action will hide the event from public view but won't permanently delete it.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmId && handleDeleteEvent(deleteConfirmId)}
            >
              Delete Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={!!permanentDeleteConfirmId} onOpenChange={() => setPermanentDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Permanently Delete Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>WARNING:</strong> This action will permanently delete this event from the database.
            </p>
            <p className="text-sm text-muted-foreground">
              This cannot be undone. The event and all its data will be completely removed forever.
            </p>
            <p className="text-sm font-medium text-red-600">
              Are you absolutely sure you want to permanently delete this event?
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setPermanentDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => permanentDeleteConfirmId && handlePermanentDeleteEvent(permanentDeleteConfirmId)}
            >
              Permanently Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}