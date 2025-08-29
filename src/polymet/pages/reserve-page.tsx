import EventCard from "@/polymet/components/event-card";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/eventsDB";
import { supabase } from "@/lib/supabase";
import type { EventDB } from "@/lib/eventsDB";

export default function ReservePage() {
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

        // Find the September 14th event (Event 11)
        const september = events.find(e => e.id === 11);
        setSeptemberEvent(september);
        setSeptemberSoldOut(!!september?.sold_out);

        // Map to legacy reservations event ids
        try {
          // Get all legacy events to map correctly
          const { data: legacyEvents } = await supabase
            .from('events')
            .select('id, event_date, max_seats')
            .order('event_date', { ascending: true });
          
          if (legacyEvents) {
            // Map primary event (August 29th) to legacy event ID 2
            const augustLegacy = legacyEvents.find(e => 
              e.event_date && e.event_date.includes('2025-08-30')
            );
            if (augustLegacy?.id) {
              setReservationEventId(augustLegacy.id);
              
              // Check if August event is sold out by checking reservations
              const { data: augustReservations } = await supabase
                .from('reservations')
                .select('seats')
                .eq('event_id', augustLegacy.id);
                
              const totalReserved = augustReservations?.reduce((sum, res) => sum + res.seats, 0) || 0;
              const isSoldOut = totalReserved >= augustLegacy.max_seats;
              setPrimarySoldOut(isSoldOut);
            }
            
            // Map September event to the new legacy event ID 3
            const septemberLegacy = legacyEvents.find(e => 
              e.event_date && e.event_date.includes('2025-09-14')
            );
            if (septemberLegacy?.id) {
              setSeptemberReservationId(septemberLegacy.id);
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
          alt="Reserve Your Spot"
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve Your Spot</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Secure your place at our exclusive events
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
              Reserve your spot for these transformative experiences
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
                button={primaryEvent.button}
                forceReserve
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
                button="Reserve Your Spot"
                forceReserve
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