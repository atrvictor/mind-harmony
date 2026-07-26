import { Button } from "@/components/ui/button";
import EventCard from "@/polymet/components/event-card";
import { Link } from "react-router-dom";
import { getMainPageEvents, type Event } from "@/data/events";
import { useState, useEffect } from "react";

export default function EventsSection() {
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getMainPageEvents(3);
        setSortedEvents(events);
      } catch (error) {
        console.error('Failed to fetch events for main page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Get the soonest event and the other events
  const nearestEvent = sortedEvents[0];
  const otherEvents = sortedEvents.slice(1);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
      {/* Background video behind the entire Upcoming Events area */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src="/drone for site.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl">
              Join us for transformative experiences that blend music,
              meditation, and mindfulness.
            </p>
          </div>
          <Link to="/events" className="mt-4 md:mt-0">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>

        {!nearestEvent ? (
          <div id="candlelight-yoga" className="rounded-lg border border-white/30 bg-white/80 p-8 text-center">
            <p className="text-lg font-medium mb-2">New events coming soon</p>
            <p className="text-muted-foreground">
              Check back shortly, or view past events on the events page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Nearest event - full width */}
            <div className="w-full" id="candlelight-yoga">
              <EventCard
                id={nearestEvent.id}
                title={nearestEvent.title}
                date={nearestEvent.date}
                time={nearestEvent.time}
                location={nearestEvent.location}
                description={nearestEvent.description}
                image={nearestEvent.image}
                featured={nearestEvent.featured}
                getTicketsLink={nearestEvent.getTicketsLink}
                button={nearestEvent.button}
              />
            </div>

            {/* Other events - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  description={event.description}
                  image={event.image}
                  featured={event.featured}
                  getTicketsLink={event.getTicketsLink}
                  button={event.button}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
