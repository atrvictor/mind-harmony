import EventCard from "@/polymet/components/event-card";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/eventsDB";
import { supabase } from "@/lib/supabase";
import type { EventDB } from "@/lib/eventsDB";

export default function RsvpPage() {
  const [primaryEvent, setPrimaryEvent] = useState<EventDB | null>(null);
  const [septemberEvent, setSeptemberEvent] = useState<EventDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [primarySoldOut, setPrimarySoldOut] = useState(false);
  const [septemberSoldOut, setSeptemberSoldOut] = useState(false);
  const [reservationEventId, setReservationEventId] = useState<number | undefined>(undefined);
  const [septemberReservationId, setSeptemberReservationId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getAllEvents();
        // Filter out past events (button explicitly set) and pick the first upcoming
        const upcoming = events.filter(e => e.button !== 'Past Event');
        const primary = upcoming[0] || null;
        setPrimaryEvent(primary);
        setPrimarySoldOut(!!primary?.sold_out);

        // Don't show September event separately since it's now the primary event
        setSeptemberEvent(null);
        setSeptemberSoldOut(false);

        // Map to legacy reservations event ids
        try {
          // Get all legacy events to map correctly
          const { data: legacyEvents } = await supabase
            .from('events')
            .select('id, event_date, max_seats')
            .order('event_date', { ascending: true });
          
          if (legacyEvents && primary) {
            // Map current primary event (September 14th 6:00 PM) to legacy event ID
            const septemberLegacy = legacyEvents.find(e => {
              if (!e.event_date || !e.event_date.includes('2025-09-14')) return false;
              const eventHour = new Date(e.event_date).getHours();
              return eventHour === 18; // 6:00 PM
            });
            if (septemberLegacy?.id) {
              setReservationEventId(septemberLegacy.id);
              
              // Check if September event is sold out by checking reservations
              const { data: septemberReservations } = await supabase
                .from('reservations')
                .select('seats')
                .eq('event_id', septemberLegacy.id);
                
              const totalReserved = septemberReservations?.reduce((sum, res) => sum + res.seats, 0) || 0;
              const isSoldOut = totalReserved >= septemberLegacy.max_seats;
              setPrimarySoldOut(isSoldOut);
            }
          }
        } catch (e) {
          // ignore mapping failure; reservation will fall back to component id
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  if (!primaryEvent && !septemberEvent) {
    return <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center">
      <div>No events found</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E5]/30">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="/optimized/katesessions_landscape_6.jpg"
          alt="RSVP"
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">RSVP</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Reserve your spot at our transformative events
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">
              RSVP for these transformative experiences
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Primary Event */}
            {primaryEvent && (
              <EventCard
                id={primaryEvent.id}
                title={primaryEvent.title}
                date={primaryEvent.date}
                time={primaryEvent.time}
                location={primaryEvent.location}
                description={primaryEvent.description}
                image={primaryEvent.image}
                featured={primaryEvent.featured}
                getTicketsLink={primaryEvent.get_tickets_link}
                button={primaryEvent.time === '6:00 PM' && primaryEvent.date?.includes('Sep 14') ? 'RSVP Now' : primaryEvent.button}
                forceReserve={primaryEvent.time === '6:00 PM' && primaryEvent.date?.includes('Sep 14') ? true : !!primaryEvent.button}
                reservationEventId={reservationEventId}
                soldOut={primarySoldOut}
              />
            )}
            
            {/* September 14th Event */}
            {septemberEvent && (
              <EventCard
                id={septemberEvent.id}
                title={septemberEvent.title}
                date={septemberEvent.date}
                time={septemberEvent.time}
                location={septemberEvent.location}
                description={septemberEvent.description}
                image={septemberEvent.image}
                featured={false}
                getTicketsLink={septemberEvent.get_tickets_link}
                button={septemberEvent.button || "RSVP Now"}
                forceReserve={septemberEvent.button !== "Private event"}
                reservationEventId={septemberReservationId}
                soldOut={septemberSoldOut}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


