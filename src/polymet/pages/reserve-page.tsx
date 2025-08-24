import EventCard from "@/polymet/components/event-card";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/eventsDB";
import { supabase } from "@/lib/supabase";
import type { EventDB } from "@/lib/eventsDB";

export default function ReservePage() {
  const [primaryEvent, setPrimaryEvent] = useState<EventDB | null>(null);
  const [secondaryEvent, setSecondaryEvent] = useState<EventDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [primarySoldOut, setPrimarySoldOut] = useState(false);
  const [secondarySoldOut, setSecondarySoldOut] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getAllEvents();
        setPrimaryEvent(events[0] || null);
        setSecondaryEvent(events[1] || null);
        // compute sold-out for legacy reservations table ids 1 and 2
        const { data: eventsLegacy } = await supabase
          .from('events')
          .select('id, max_seats');
        const { data: reservations } = await supabase
          .from('reservations')
          .select('event_id, seats');
        const event1 = (eventsLegacy || []).find(e => e.id === 1);
        if (event1) {
          const reserved = (reservations || [])
            .filter(r => r.event_id === 1)
            .reduce((sum, r) => sum + (r.seats || 0), 0);
          setPrimarySoldOut(reserved >= event1.max_seats);
        }
        const event2 = (eventsLegacy || []).find(e => e.id === 2);
        if (event2) {
          const reserved2 = (reservations || [])
            .filter(r => r.event_id === 2)
            .reduce((sum, r) => sum + (r.seats || 0), 0);
          setSecondarySoldOut(reserved2 >= event2.max_seats);
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
              reservationEventId={1}
              soldOut={primarySoldOut}
            />
          </div>
          {secondaryEvent && (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold">Reserve the Next Event</h3>
                <p className="text-muted-foreground">If the current event is full, save your spot for the next one.</p>
              </div>
              <EventCard
                id={secondaryEvent.id}
                title={secondaryEvent.title}
                date={secondaryEvent.date}
                time={secondaryEvent.time}
                location={secondaryEvent.location}
                description={secondaryEvent.description}
                image={secondaryEvent.image}
                featured={false}
                suppressFeaturedLayout
                getTicketsLink={secondaryEvent.get_tickets_link}
                button={secondaryEvent.button}
                forceReserve
                reservationEventId={2}
                soldOut={secondarySoldOut}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 