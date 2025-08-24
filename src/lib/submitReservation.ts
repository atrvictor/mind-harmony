import { supabase } from './supabase';

export async function submitReservation({ eventId, name, email, phone, seats, donation, eventName, eventDate, eventLocation: overrideLocation, eventAddress: overrideAddress, eventTime: overrideTime }: {
  eventId: number;
  name: string;
  email: string;
  phone?: string;
  seats: number;
  donation?: number;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  eventAddress?: string;
  eventTime?: string;
}) {
  // 1. Get event info
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name, event_date, max_seats, location, address, time')
    .eq('id', eventId)
    .single();
  if (eventError || !event) {
    return { success: false, error: 'Event not found.' };
  }

  // 2. Get current reservations for this event
  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select('seats')
    .eq('event_id', eventId);
  if (resError) {
    return { success: false, error: 'Could not check reservations.' };
  }
  const seatsReserved = reservations.reduce((sum, r) => sum + (r.seats || 0), 0);
  const seatsAvailable = event.max_seats - seatsReserved;
  if (seats > seatsAvailable) {
    return { success: false, error: 'Sold out or not enough seats available.' };
  }

  // 3. Insert reservation
  const { error: insertError } = await supabase.from('reservations').insert({
    event_id: eventId,
    visitor_name: name,
    visitor_email: email,
    phone,
    seats,
    donation,
  });
  if (insertError) {
    return { success: false, error: 'Could not save reservation.' };
  }

  // 4. Call serverless function to send emails
  try {
    // Prefer overrides passed in (from Reserve page card), fallback to DB event data
    const eventTitle = eventName || event.name;
    const eventLocation = overrideLocation ?? event.location;
    const eventAddress = overrideAddress ?? event.address;
    const eventTime = overrideTime ?? event.time;
    // Format date as 'Month Day, Year' (prefer provided eventDate string)
    const eventDateFormatted = eventDate || new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    console.log('About to send email with data:', {
      eventTitle,
      eventLocation,
      eventAddress,
      eventTime,
      eventDateFormatted
    });
    
    const response = await fetch('/api/sendReservationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: name,
        visitorEmail: email,
        eventName: eventTitle,
        eventDate: eventDateFormatted,
        seats,
        donation,
        eventLocation,
        eventAddress,
        eventTime,
      }),
    });
    
    const result = await response.text();
    console.log('Email API response:', response.status, result);
    
    if (!response.ok) {
      console.error('Email API failed:', response.status, result);
    }
  } catch (e) {
    // Email failure should not block reservation
    console.error('Email API error:', e);
  }

  return { success: true, seatsAvailable: seatsAvailable - seats };
} 