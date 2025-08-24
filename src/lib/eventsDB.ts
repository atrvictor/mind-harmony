/**
 * Database functions for Events Management
 * Handles all CRUD operations for events stored in Supabase
 */

import { supabase } from './supabase';

export interface EventDB {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  address?: string;
  description: string;
  image: string;
  featured?: boolean;
  get_tickets_link?: string;
  button?: string;
  display_order: number;
  is_active: boolean;
  status: 'draft' | 'published';
  sold_out?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  date: string;
  time: string;
  location?: string;
  address?: string;
  description: string;
  image: string;
  featured?: boolean;
  get_tickets_link?: string;
  button?: string;
  display_order?: number;
  is_active?: boolean;
  status?: 'draft' | 'published';
  sold_out?: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number;
}

/**
 * Get all active events, sorted by display_order
 */
export async function getAllEvents(): Promise<EventDB[]> {
  const { data, error } = await supabase
    .from('events_management')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all events (including inactive) for admin panel
 */
export async function getAllEventsForAdmin(): Promise<EventDB[]> {
  const { data, error } = await supabase
    .from('events_management')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all events for admin:', error);
    throw new Error(`Failed to fetch events for admin: ${error.message}`);
  }

  return data || [];
}

/**
 * Get events sorted by date (for main page display)
 */
export async function getEventsByDate(): Promise<EventDB[]> {
  const events = await getAllEvents();
  
  // Sort by date (convert date string to Date object for proper sorting)
  return events.sort((a, b) => {
    const dateA = new Date(a.date + ', 2025');
    const dateB = new Date(b.date + ', 2025');
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Get featured events
 */
export async function getFeaturedEvents(): Promise<EventDB[]> {
  const { data, error } = await supabase
    .from('events_management')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'published')
    .eq('featured', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured events:', error);
    throw new Error(`Failed to fetch featured events: ${error.message}`);
  }

  return data || [];
}

/**
 * Get events for main page (first N events sorted by date)
 */
export async function getMainPageEvents(count: number = 3): Promise<EventDB[]> {
  const events = await getEventsByDate();
  return events.slice(0, count);
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: number): Promise<EventDB | null> {
  const { data, error } = await supabase
    .from('events_management')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching event:', error);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

/**
 * Duplicate an existing event (creates a new draft at the end of the list)
 */
export async function duplicateEvent(originalId: number): Promise<EventDB> {
  // Fetch the original event (include drafts/inactive)
  const original = await getEventByIdForAdmin(originalId);
  if (!original) {
    throw new Error('Original event not found');
  }

  // Prepare new event data
  const newEventData: CreateEventData = {
    title: `${original.title} (Copy)`,
    date: original.date,
    time: original.time,
    location: original.location || '',
    address: original.address || '',
    description: original.description,
    image: original.image,
    featured: false,
    get_tickets_link: original.get_tickets_link || '',
    button: original.button || '',
    status: 'draft',
    is_active: false,
  };

  // Use existing create flow to compute display_order
  const created = await createEvent(newEventData);
  return created;
}

/**
 * Create a new event
 */
export async function createEvent(eventData: CreateEventData): Promise<EventDB> {
  // Get the next display_order
  const { data: lastEvent } = await supabase
    .from('events_management')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastEvent?.display_order || 0) + 1;

  const { data, error } = await supabase
    .from('events_management')
    .insert([{
      ...eventData,
      display_order: eventData.display_order || nextOrder
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data;
}

/**
 * Duplicate an event and insert the copy directly below the original.
 * The new event will be a draft and inactive, with display_order adjusted
 * so it appears immediately after the original.
 */
export async function duplicateEventBelow(originalId: number): Promise<EventDB> {
  // Fetch events to compute ordering
  const { data: orderRows, error: orderError } = await supabase
    .from('events_management')
    .select('id, display_order')
    .order('display_order', { ascending: true });

  if (orderError) {
    throw new Error(`Failed to fetch events for ordering: ${orderError.message}`);
  }

  const originalIndex = orderRows.findIndex(e => e.id === originalId);
  if (originalIndex === -1) {
    throw new Error('Original event not found for ordering');
  }

  const originalOrder = orderRows[originalIndex].display_order;

  // Shift all events that come after the original down by 1 to make room
  const updates = orderRows
    .filter(e => e.display_order > originalOrder)
    .map(e => ({ id: e.id, display_order: e.display_order + 1 }));

  if (updates.length > 0) {
    await updateEventsOrder(updates);
  }

  // Fetch the full original event
  const original = await getEventByIdForAdmin(originalId);
  if (!original) {
    throw new Error('Original event not found');
  }

  // Create the copy with the new order, as inactive draft
  const created = await createEvent({
    title: `${original.title} (Copy)`,
    date: original.date,
    time: original.time,
    location: original.location || '',
    address: original.address || '',
    description: original.description,
    image: original.image,
    featured: false,
    get_tickets_link: original.get_tickets_link || '',
    button: original.button || '',
    status: 'draft',
    is_active: false,
    display_order: originalOrder + 1,
  });

  return created;
}

/**
 * Update an existing event
 */
export async function updateEvent(eventData: UpdateEventData): Promise<EventDB> {
  const { id, ...updateData } = eventData;

  const { data, error } = await supabase
    .from('events_management')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data;
}

/**
 * Delete an event (soft delete by setting is_active to false)
 */
export async function deleteEvent(id: number): Promise<void> {
  const { error } = await supabase
    .from('events_management')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

/**
 * Permanently delete an event (hard delete)
 */
export async function permanentlyDeleteEvent(id: number): Promise<void> {
  const { error } = await supabase
    .from('events_management')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error permanently deleting event:', error);
    throw new Error(`Failed to permanently delete event: ${error.message}`);
  }
}

/**
 * Restore a deleted event
 */
export async function restoreEvent(id: number): Promise<EventDB> {
  const { data, error } = await supabase
    .from('events_management')
    .update({ is_active: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error restoring event:', error);
    throw new Error(`Failed to restore event: ${error.message}`);
  }

  return data;
}

/**
 * Update display order for multiple events
 */
export async function updateEventsOrder(eventOrders: { id: number; display_order: number }[]): Promise<void> {
  const updates = eventOrders.map(({ id, display_order }) => 
    supabase
      .from('events_management')
      .update({ display_order })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  
  for (const result of results) {
    if (result.error) {
      console.error('Error updating event order:', result.error);
      throw new Error(`Failed to update event order: ${result.error.message}`);
    }
  }
}

/**
 * Toggle featured status of an event
 */
/**
 * Get event by ID for admin purposes (includes draft events)
 */
async function getEventByIdForAdmin(id: number): Promise<EventDB | null> {
  const { data, error } = await supabase
    .from('events_management')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching event for admin:', error);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

export async function toggleEventFeatured(id: number): Promise<EventDB> {
  // First, get current featured status (using admin function to get draft events too)
  const currentEvent = await getEventByIdForAdmin(id);
  if (!currentEvent) {
    throw new Error('Event not found');
  }

  const { data, error } = await supabase
    .from('events_management')
    .update({ featured: !currentEvent.featured })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling event featured status:', error);
    throw new Error(`Failed to toggle event featured status: ${error.message}`);
  }

  return data;
}

/**
 * Toggle status of an event (draft/published)
 */
export async function toggleEventStatus(id: number): Promise<EventDB> {
  // First, get current status
  const currentEvent = await getEventByIdForAdmin(id);
  if (!currentEvent) {
    throw new Error('Event not found');
  }

  const newStatus = currentEvent.status === 'draft' ? 'published' : 'draft';

  const { data, error } = await supabase
    .from('events_management')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling event status:', error);
    throw new Error(`Failed to toggle event status: ${error.message}`);
  }

  return data;
}

/**
 * Move event up in display order
 */
export async function moveEventUp(eventId: number): Promise<void> {
  // Get all events ordered by display_order
  const { data: events, error } = await supabase
    .from('events_management')
    .select('id, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events for reordering: ${error.message}`);
  }

  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex <= 0) {
    // Already at the top or not found
    return;
  }

  // Swap with the previous event
  const updates = [
    { id: events[eventIndex].id, display_order: events[eventIndex - 1].display_order },
    { id: events[eventIndex - 1].id, display_order: events[eventIndex].display_order }
  ];

  await updateEventsOrder(updates);
}

/**
 * Move event down in display order
 */
export async function moveEventDown(eventId: number): Promise<void> {
  // Get all events ordered by display_order
  const { data: events, error } = await supabase
    .from('events_management')
    .select('id, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events for reordering: ${error.message}`);
  }

  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex < 0 || eventIndex >= events.length - 1) {
    // Already at the bottom or not found
    return;
  }

  // Swap with the next event
  const updates = [
    { id: events[eventIndex].id, display_order: events[eventIndex + 1].display_order },
    { id: events[eventIndex + 1].id, display_order: events[eventIndex].display_order }
  ];

  await updateEventsOrder(updates);
}

/**
 * Get events statistics for admin dashboard
 */
export async function getEventsStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  featured: number;
  upcoming: number;
  past: number;
}> {
  const { data, error } = await supabase
    .from('events_management')
    .select('is_active, featured, button');

  if (error) {
    console.error('Error fetching events stats:', error);
    throw new Error(`Failed to fetch events stats: ${error.message}`);
  }

  const stats = {
    total: data.length,
    active: data.filter(e => e.is_active).length,
    inactive: data.filter(e => !e.is_active).length,
    featured: data.filter(e => e.is_active && e.featured).length,
    upcoming: data.filter(e => e.is_active && e.button !== 'Past Event').length,
    past: data.filter(e => e.is_active && e.button === 'Past Event').length,
  };

  return stats;
}

/** Toggle manual sold out flag */
export async function toggleEventSoldOut(id: number): Promise<EventDB> {
  const current = await getEventByIdForAdmin(id);
  if (!current) throw new Error('Event not found');
  const { data, error } = await supabase
    .from('events_management')
    .update({ sold_out: !current.sold_out })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Failed to toggle sold out: ${error.message}`);
  return data;
}