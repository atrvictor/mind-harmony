import { Button } from "@/components/ui/button";
import EventCard from "@/polymet/components/event-card";
import { Link } from "react-router-dom";

export default function EventsSection() {
  const events = [
    {
      id: 1,
      title: "Candlelight Yoga and Piano",
      date: "May 18th, 2025",
      time: "7:00 PM",
      description:
        "Experience the harmonious blend of gentle yoga flows guided by live piano music in a serene, candlelit environment. Perfect for all levels.",
      image: "/CandlelightYoga.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Mindful Piano Meditation",
      date: "June 5th, 2025",
      time: "6:30 PM",
      description:
        "Join us for an evening of guided meditation accompanied by soothing piano melodies to help calm your mind and rejuvenate your spirit.",
      image: "/piano photos/piano_keys_hammers_tricolor_nocandle_2.jpg",
    },
    {
      id: 3,
      title: "Sound Bath & Piano Journey",
      date: "June 15th, 2025",
      time: "8:00 PM",
      description:
        "Immerse yourself in healing vibrations of crystal bowls harmonized with piano compositions for deep relaxation and inner peace.",
      image: "/piano photos/piano_macro_hammers_purple_candlelight_1.jpg",
    },
  ];

  // Sort events by date (closest first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date + ", 2025").getTime() - new Date(b.date + ", 2025").getTime();
  });

  // Get the soonest event and the other events
  const nearestEvent = sortedEvents[0];
  const otherEvents = sortedEvents.slice(1);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
      <div className="max-w-7xl mx-auto">
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

        <div className="space-y-6">
          {/* Nearest event - full width */}
          <div className="w-full" id="candlelight-yoga">
            <EventCard
              key={nearestEvent.id}
              title={nearestEvent.title}
              date={nearestEvent.date}
              time={nearestEvent.time}
              description={nearestEvent.description}
              image={nearestEvent.image}
              featured={nearestEvent.featured}
              getTicketsLink={nearestEvent.title === "Candlelight Yoga and Piano" ? "https://www.eventbrite.com/e/candlelit-yoga-to-live-piano-by-dom-and-victor-may-tickets-1342976190939?aff=erelexpmlt" : undefined}
            />
          </div>

          {/* Other events - side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              description={event.description}
              image={event.image}
              featured={event.featured}
                getTicketsLink={event.title === "Candlelight Yoga and Piano" ? "https://www.eventbrite.com/e/candlelit-yoga-to-live-piano-by-dom-and-victor-may-tickets-1342976190939?aff=erelexpmlt" : undefined}
            />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
