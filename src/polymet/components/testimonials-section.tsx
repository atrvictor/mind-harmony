import TestimonialCard from "@/polymet/components/testimonial-card";
import HebrewLetterAnimation from "@/polymet/components/hebrew-letter-animation";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Mind Harmony's piano meditations have completely transformed my approach to mindfulness. The combination of music and guided reflection creates a truly unique experience.",
      name: "Olga K.",
      title: "Regular Attendee",
      avatarSrc: "https://picsum.photos/seed/olga/100/100",
    },
    {
      id: 2,
      quote:
        "I've attended many meditation sessions, but none compare to the depth and peace I experience at Mind Harmony events. The piano element adds something truly special.",
      name: "Michael T.",
      title: "Yoga Practitioner",
      avatarSrc: "https://picsum.photos/seed/michael/100/100",
    },
    {
      id: 3,
      quote:
        "As someone who struggled with traditional meditation, Mind Harmony's approach was exactly what I needed. The music guides you naturally into a meditative state.",
      name: "Masha L.",
      title: "First-time Meditator",
      avatarSrc: "https://picsum.photos/seed/masha/100/100",
    },
    {
      id: 4,
      quote:
        "The candlelight yoga and piano session was transformative. I left feeling both energized and deeply relaxed. I've already signed up for the next event!",
      name: "Isabella R.",
      title: "Monthly Member",
      avatarSrc: "https://picsum.photos/seed/isabella/100/100",
    },
    {
      id: 5,
      quote:
        "Victor has created something truly special with Mind Harmony. His piano playing creates the perfect atmosphere for deep introspection and personal growth.",
      name: "Daniel M.",
      title: "Wellness Coach",
      avatarSrc: "https://picsum.photos/seed/daniel/100/100",
    },
    {
      id: 6,
      quote:
        "The group meditation sessions have helped me connect with like-minded individuals while finding inner peace. The piano accompaniment elevates the entire experience to something magical.",
      name: "Sarah J.",
      title: "Community Member",
      avatarSrc: "https://picsum.photos/seed/sarah/100/100",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how Mind Harmony has helped others find peace, clarity, and
            connection through our unique approach to meditation and
            mindfulness.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                name={testimonial.name}
                title={testimonial.title}
                avatarSrc={testimonial.avatarSrc}
              />
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-30 pointer-events-none">
            <HebrewLetterAnimation color="#1E3A5F" size="lg" interval={5000} />
          </div>
        </div>
      </div>
    </section>
  );
}
