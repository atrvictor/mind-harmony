import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import EventCard from "@/polymet/components/event-card";
import { getAllEvents, type Event } from "@/data/events";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getAllEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Failed to fetch events for events page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function EventGridCard({ event }: { event: Event }) {
    return (
      <EventCard
        id={event.id}
        title={event.title}
        date={event.date}
        time={event.time}
        description={event.description}
        image={event.image}
        location={event.location}
        getTicketsLink={event.getTicketsLink}
        featured={event.id === 1}
        suppressFeaturedLayout={true}
        button={event.button}
      />
    );
  }

  // Split events for display (first 3 for upcoming section, rest for past)
  const upcoming = upcomingEvents.slice(0, 3);
  const past = upcomingEvents.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/optimized/katesessions_landscape_6.jpg"
          alt="Mind Harmony Events"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Events</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Join us for transformative experiences that blend piano music,
              meditation, and mindfulness practices.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore our calendar of events and reserve your spot today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">May - July 2025</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventGridCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((event) => (
              <EventGridCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Event Information Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">What to Expect</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our events are designed to create a space where you can
                  disconnect from the outside world and reconnect with yourself
                  through the power of music and mindfulness.
                </p>
                <p>
                  Each session is carefully crafted to provide a unique
                  experience, whether you're joining us for a candlelit yoga
                  session accompanied by live piano, or a deep meditation
                  journey guided by soothing melodies.
                </p>
                <p>
                  No prior experience with meditation or yoga is necessary - our
                  events are welcoming to all levels and backgrounds.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold">Location Information</h3>
                <p className="text-muted-foreground">
                  Most of our events take place at Think Simpler Sojourn, a private home in Mt. Soledad, La Jolla. Some special events may be held at different venues – please check the specific event details for location information.
                </p>
                <Button variant="outline" className="mt-2">
                  View Venue Details
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src="/optimized/gliderport_revised_2.jpg"
                  alt="Mind Harmony event venue"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-md hidden md:block">
                <img
                  src="https://picsum.photos/seed/mindharmonycandle/200/200"
                  alt="Candlelight atmosphere"
                  className="rounded w-[100px] h-[100px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

