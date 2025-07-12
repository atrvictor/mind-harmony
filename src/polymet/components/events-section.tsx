import { Button } from "@/components/ui/button";
import EventCard from "@/polymet/components/event-card";
import { Link } from "react-router-dom";

export default function EventsSection() {
  const events = [
    {
      id: 1,
      title: "Piano Meditation Experience",
      date: "July 19th, 2025",
      time: "6:30 PM",
      location: "Mission Bay",
      description:
        "Breathe in the ocean air, and let Victor Kulish guide you into deep calm as the sun melts into Mission Bay.",
      image: "/MH Milana DSC03938.jpg",
      featured: true,
      getTicketsLink: "https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1418832870309?aff=oddtdtcreator",
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
              getTicketsLink={nearestEvent.getTicketsLink}
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
