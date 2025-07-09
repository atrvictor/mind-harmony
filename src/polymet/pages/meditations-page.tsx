import { Button } from "@/components/ui/button";
import { MusicIcon, PlayIcon } from "lucide-react";

export default function MeditationsPage() {
  const featuredMeditations = [
    {
      id: 1,
      title: "Clarity Through Sound",
      duration: "15 min",
      description:
        "A gentle piano-guided meditation to help clear your mind and find focus.",
      image: "https://picsum.photos/seed/meditation1/800/500",
      category: "Focus",
    },
    {
      id: 2,
      title: "Evening Relaxation",
      duration: "20 min",
      description:
        "Wind down after a long day with soothing piano melodies and guided breathing.",
      image: "https://picsum.photos/seed/meditation2/800/500",
      category: "Relaxation",
    },
    {
      id: 3,
      title: "Morning Awakening",
      duration: "10 min",
      description:
        "Start your day with intention through uplifting piano compositions and mindfulness.",
      image: "https://picsum.photos/seed/meditation3/800/500",
      category: "Energy",
    },
    {
      id: 4,
      title: "Deep Healing Journey",
      duration: "30 min",
      description:
        "A profound meditation experience combining piano with healing frequencies.",
      image: "https://picsum.photos/seed/meditation4/800/500",
      category: "Healing",
    },
    {
      id: 5,
      title: "Stress Release",
      duration: "18 min",
      description:
        "Let go of tension and anxiety with this calming piano meditation.",
      image: "https://picsum.photos/seed/meditation5/800/500",
      category: "Stress Relief",
    },
    {
      id: 6,
      title: "Creative Flow",
      duration: "25 min",
      description:
        "Unlock your creative potential with this inspiring musical journey.",
      image: "https://picsum.photos/seed/meditation6/800/500",
      category: "Creativity",
    },
  ];

  const categories = [
    "All",
    "Focus",
    "Relaxation",
    "Energy",
    "Healing",
    "Stress Relief",
    "Creativity",
    "Sleep",
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/katesessions_blonde_woman_right_facing_left_1.jpg"
          alt="Kate Sessions Park blonde woman right facing left"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MusicIcon size={16} />

              <span>Coming Soon</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Guided Meditations
            </h1>
            <p className="max-w-2xl mx-auto text-lg">
              Our interactive meditation platform is currently in development.
              Preview our upcoming offerings below.
            </p>
          </div>
        </div>
      </div>

      {/* Email Signup Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Be the First to Know</h2>
          <p className="text-muted-foreground mb-6">
            Sign up to receive early access to our meditation platform and
            exclusive content.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
              required
            />

            <Button type="submit">Notify Me</Button>
          </form>
        </div>
      </section>

      {/* Meditation Preview Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Meditations</h2>
              <p className="text-muted-foreground max-w-2xl">
                Preview our upcoming meditation sessions guided by piano music.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    category === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Meditation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMeditations.map((meditation) => (
              <div
                key={meditation.id}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={meditation.image}
                    alt={meditation.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/90 text-[#1E3A5F] rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <PlayIcon size={24} />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded">
                    {meditation.duration}
                  </div>
                  <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                    {meditation.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {meditation.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {meditation.description}
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F0F9] mb-4">
                <MusicIcon className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Piano-Guided Sessions
              </h3>
              <p className="text-muted-foreground">
                Unique meditations featuring original piano compositions
                designed to enhance mindfulness.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F0F9] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#1E3A5F]"
                >
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="m4.93 4.93 2.83 2.83"></path>
                  <path d="m16.24 16.24 2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="m4.93 19.07 2.83-2.83"></path>
                  <path d="m16.24 7.76 2.83-2.83"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-muted-foreground">
                Receive meditation suggestions tailored to your needs, mood, and
                goals.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F0F9] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#1E3A5F]"
                >
                  <path d="M2 12h10"></path>
                  <path d="M9 4v16"></path>
                  <path d="M14 9v2"></path>
                  <path d="M14 17v2"></path>
                  <path d="M14 4v2"></path>
                  <path d="M22 12h-8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your meditation journey with detailed insights and
                statistics.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F0F9] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#1E3A5F]"
                >
                  <path d="M12 3v12"></path>
                  <path d="m8 11 4 4 4-4"></path>
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Downloadable Resources
              </h3>
              <p className="text-muted-foreground">
                Access reflection worksheets and supplementary materials to
                enhance your practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                When will the meditation platform launch?
              </h3>
              <p className="text-muted-foreground">
                We're currently in the final stages of development and plan to
                launch in Summer 2025. Sign up for our newsletter to be notified
                as soon as we go live.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                Do I need prior meditation experience?
              </h3>
              <p className="text-muted-foreground">
                Not at all! Our platform is designed for both beginners and
                experienced practitioners. The piano guidance makes it easier
                for newcomers to maintain focus.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                Will there be a mobile app?
              </h3>
              <p className="text-muted-foreground">
                Yes, we're developing both web and mobile applications to make
                our meditations accessible wherever you are.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                How is piano-guided meditation different?
              </h3>
              <p className="text-muted-foreground">
                Piano-guided meditation uses carefully composed piano music to
                help guide your focus and enhance the meditative experience.
                Many find it easier to maintain mindfulness with musical
                guidance compared to silent meditation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
