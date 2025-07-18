import EventsSection from "@/polymet/components/events-section";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useScrollZoom } from "@/hooks/useScrollZoom";

export default function EventsPage() {
  // Additional events for the events page
  const upcomingEvents = [
    {
      id: 1,
      title: "Piano Meditation Experience",
      date: "July 19th, 2025",
      time: "6:30 PM",
      location: "Mission Bay",
      description:
        "Breathe in the ocean air, and let Victor Kulish guide you into deep calm as the sun melts into Mission Bay.",
      image: "/MH Milana DSC03938.jpg",
    },
    {
      id: 2,
      title: "Sunset Piano Meditation Popup",
      date: "July 12th, 2025",
      time: "6:30 PM",
      location: "Pacific Beach",
      description:
        "Join us for an evening of guided meditation and piano melodies as the sun sets, creating a tranquil atmosphere for relaxation and reflection.",
      image: "/MH_Columet_edited.png",
    },
    {
      id: 3,
      title: "Roots Bday Meditation & Piano Journey",
      date: "July 27th, 2025",
      time: "5:00 PM",
      description:
        "Experience the compositions from the upcoming Roots Piano album, accompanied by an immersive story that guides you between the songs. Designed as both a meditation and a journey, it leads you into deep relaxation and inner peace.",
      image: "/MH Milana DSC03928.jpg",
    },
    {
      id: 4,
      title: "Candlelight Yoga and Piano",
      date: "May 18th, 2025",
      time: "7:00 PM",
      description:
        "Experience the harmonious blend of gentle yoga flows guided by live piano music in a serene, candlelit environment. Perfect for all levels.",
      image: "/CandlelightYoga.jpg",
    },
    {
      id: 5,
      title: "Morning Awakening: Piano & Breathwork",
      date: "May 12th, 2025",
      time: "8:00 AM",
      description:
        "Start your day with intention through this energizing combination of breathwork exercises and uplifting piano compositions.",
      image: "/piano photos/piano_keys_tricolor_nocandle_1.jpg",
    },
    {
      id: 6,
      title: "Piano Meditation for Stress Relief",
      date: "April 10th, 2025",
      time: "6:00 PM",
      description:
        "A focused session designed specifically to address stress and anxiety through guided meditation and calming piano melodies.",
      image: "/piano photos/piano_macro_keys_purple_candlelight_1.jpg",
    },
  ];

  function EventGridCard({ event, isPastEvent = false }: { event: EventType, isPastEvent?: boolean }) {
    const { containerRef, isActive } = useScrollZoom(0.4);
    return (
      <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md">
        <div
          ref={containerRef}
          className={`relative overflow-hidden ${event.featured ? "h-64 md:h-80" : "h-48"}`}
        >
          <img
            src={event.image}
            alt={event.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110 group-active:scale-110 ${isActive ? "scale-105" : ""}`}
          />

          {event.featured && (
            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
              Featured Event
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CalendarIcon size={16} />

            <span>
              {event.location
                ? `${event.date} • ${event.time} • ${event.location}`
                : event.title === "Candlelight Yoga and Piano"
                ? `${event.date} • ${event.time} • La Jolla`
                : `${event.date} • ${event.time}`}
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>

          {event.getTicketsLink ? (
            <a
              href={event.getTicketsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block"
            >
              <Button className="w-full">Get Tickets</Button>
            </a>
          ) : (
            <Button className="w-full" disabled>{isPastEvent ? "Past Event" : "Coming Soon"}</Button>
          )}
        </div>
      </div>
    );
  }

  // Define the event type to include getTicketsLink and featured
  type EventType = typeof upcomingEvents[0] & { getTicketsLink?: string; featured?: boolean };

  // Split the events into upcoming and past based on their order in the array
  const upcoming: EventType[] = upcomingEvents.slice(0, 3);
  const past: EventType[] = upcomingEvents.slice(3);

  // Copy the updated ticket link for the featured event
  const ticketLink = "https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1418832870309?aff=oddtdtcreator";

  // Only set 'featured' for the first upcoming event
  const updatedUpcoming: EventType[] = upcoming.map((event, idx) =>
    idx === 0
      ? { ...event, featured: true, getTicketsLink: ticketLink }
      : { ...event }
  );

  // Ensure all events passed to EventGridCard have getTicketsLink property
  const updatedPast: EventType[] = past.map((event) => ({ ...event, getTicketsLink: event.getTicketsLink }));

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/katesessions_landscape_6.jpg"
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
            {updatedUpcoming.map((event) => (
              <EventGridCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updatedPast.map((event) => (
              <EventGridCard key={event.id} event={event} isPastEvent />
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
                  src="/gliderport_revised_2.jpg"
                  alt="Mind Harmony event venue"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-md hidden md:block">
                <img
                  src="https://picsum.photos/seed/mindharmonycandle/200/200"
                  alt="Candlelight atmosphere"
                  className="rounded w-[100px] h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

