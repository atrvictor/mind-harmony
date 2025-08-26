import EventCard from "@/polymet/components/event-card";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/eventsDB";
import { supabase } from "@/lib/supabase";
import type { EventDB } from "@/lib/eventsDB";

export default function ReservePage() {
  const [primaryEvent, setPrimaryEvent] = useState<EventDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [primarySoldOut, setPrimarySoldOut] = useState(false);
  const [reservationEventId, setReservationEventId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getAllEvents();
        // Filter out past events (button explicitly set) and pick the first upcoming
        const upcoming = events.filter(e => e.button !== 'Past Event');
        const primary = upcoming[0] || null;
        setPrimaryEvent(primary);
        setPrimarySoldOut(!!primary?.sold_out);

        // Map to legacy reservations event id by choosing the nearest upcoming legacy event
        try {
          const { data: upcomingLegacy } = await supabase
            .from('events')
            .select('id, event_date')
            .gte('event_date', new Date().toISOString())
            .order('event_date', { ascending: true })
            .limit(1)
            .maybeSingle();
          if (upcomingLegacy?.id) {
            setReservationEventId(upcomingLegacy.id);
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

  if (!primaryEvent) {
    return <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center">
      <div>Event not found</div>
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

      {/* Event Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Featured Event</h2>
            <p className="text-muted-foreground">
              Don't miss this transformative experience
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
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
          </div>
          {/* Secondary event intentionally removed for clarity; only current upcoming event is reservable */}
        </div>
      </section>
    </div>
  );
} 