/**
 * Centralized Events Data - Database Version
 * 
 * This is the single source of truth for all events across the application.
 * Events are now stored in Supabase and can be managed through the admin panel.
 */

import { 
  getAllEvents as dbGetAllEvents, 
  getEventsByDate as dbGetEventsByDate,
  getMainPageEvents as dbGetMainPageEvents,
  getFeaturedEvents as dbGetFeaturedEvents,
  type EventDB 
} from '@/lib/eventsDB';

// Export the Event interface for components to use (mapped from database format)
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  address?: string;
  description: string;
  image: string;
  featured?: boolean;
  getTicketsLink?: string;
  button?: string;
}

/**
 * Parse human-friendly date strings like "August 15th, 2025" with optional time
 * into a Date object. Removes ordinal suffixes (st, nd, rd, th).
 */
function parseEventDateTime(dateStr: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  try {
    const cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const combined = timeStr ? `${cleanedDate} ${timeStr}` : cleanedDate;
    const parsed = new Date(combined);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Convert database event to frontend event format
 */
function mapEventFromDB(dbEvent: EventDB): Event {
  const parsedDate = parseEventDateTime(dbEvent.date, dbEvent.time);
  const isPast = parsedDate ? parsedDate.getTime() < Date.now() : false;
  const rawButton = dbEvent.button?.trim();
  const normalizedButton = rawButton
    ? rawButton.replace(/\s+/g, ' ').trim()
    : undefined;
  const normalizedCaseButton = normalizedButton
    ? (normalizedButton.toLowerCase() === 'past event'
        ? 'Past Event'
        : normalizedButton.toLowerCase() === 'coming soon'
        ? 'Coming Soon'
        : normalizedButton)
    : undefined;

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.date,
    time: dbEvent.time,
    location: dbEvent.location || undefined,
    address: dbEvent.address || undefined,
    description: dbEvent.description,
    image: dbEvent.image,
    featured: dbEvent.featured || undefined,
    getTicketsLink: dbEvent.get_tickets_link || undefined,
    // Automatically mark past events; otherwise use normalized button text
    button: isPast ? 'Past Event' : (normalizedCaseButton || undefined),
  };
}

/**
 * Get events sorted by date (closest first)
 */
export async function getEventsByDate(): Promise<Event[]> {
  try {
    const dbEvents = await dbGetEventsByDate();
    return dbEvents.map(mapEventFromDB);
  } catch (error) {
    console.error('Failed to fetch events by date:', error);
    return [];
  }
}

/**
 * Get the first N events for main page display (sorted by date)
 */
export async function getMainPageEvents(count: number = 3): Promise<Event[]> {
  try {
    const dbEvents = await dbGetMainPageEvents(count);
    return dbEvents.map(mapEventFromDB);
  } catch (error) {
    console.error('Failed to fetch main page events:', error);
    return [];
  }
}

/**
 * Get all events for the events page
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const dbEvents = await dbGetAllEvents();
    return dbEvents.map(mapEventFromDB);
  } catch (error) {
    console.error('Failed to fetch all events:', error);
    return [];
  }
}

/**
 * Get upcoming events (for events page display)
 */
export async function getUpcomingEvents(count?: number): Promise<Event[]> {
  try {
    const dbEvents = await dbGetAllEvents();
    const events = dbEvents.map(mapEventFromDB);
    return count ? events.slice(0, count) : events;
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error);
    return [];
  }
}

/**
 * Get past events
 */
export async function getPastEvents(): Promise<Event[]> {
  try {
    const dbEvents = await dbGetAllEvents();
    return dbEvents
      .map(mapEventFromDB)
      .filter(event => event.button === "Past Event");
  } catch (error) {
    console.error('Failed to fetch past events:', error);
    return [];
  }
}

/**
 * Get featured events
 */
export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const dbEvents = await dbGetFeaturedEvents();
    return dbEvents.map(mapEventFromDB);
  } catch (error) {
    console.error('Failed to fetch featured events:', error);
    return [];
  }
}