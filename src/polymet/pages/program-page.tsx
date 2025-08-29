import { Button } from "@/components/ui/button";
import { MusicIcon, HeartIcon, CalendarIcon, ClockIcon } from "lucide-react";

export default function ProgramPage() {
  return (
    <div>
      {/* Hero Section with Program Background */}
      <div className="relative h-[600px] overflow-hidden">
        <img
          src="/Program1.jpg"
          alt="Mind Harmony Program Background"
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Program
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              Immerse yourself in transformative experiences that blend music, 
              meditation, and mindfulness to unlock your inner harmony.
            </p>
          </div>
        </div>
      </div>

      {/* Program Overview Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our carefully crafted programs combine the healing power of piano music 
              with guided meditation practices, creating unique experiences that nurture 
              your mind, body, and spirit.
            </p>
          </div>

          {/* Program Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5F0F9] mb-4">
                <MusicIcon className="h-6 w-6 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Piano Meditation</h3>
              <p className="text-muted-foreground">
                Experience guided meditations accompanied by live piano compositions, 
                creating a deeply immersive and healing environment.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F0E5] mb-4">
                <HeartIcon className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mindfulness Practices</h3>
              <p className="text-muted-foreground">
                Learn practical mindfulness techniques that you can integrate into 
                your daily life for lasting peace and clarity.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5F0F9] mb-4">
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
                  className="h-6 w-6 text-[#1E3A5F]"
                >
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personal Transformation</h3>
              <p className="text-muted-foreground">
                Discover your inner strength and unlock your potential through our 
                transformative approach to meditation and self-discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details Section - Placeholder for your content */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Program Details</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              {/* Placeholder for your program details */}
              Detailed program information will be added here. This section is ready 
              for your specific program content, schedules, and descriptions.
            </p>
          </div>

          {/* Program Schedule Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="h-5 w-5 text-[#1E3A5F]" />
                <h3 className="text-xl font-semibold">Schedule</h3>
              </div>
              <p className="text-muted-foreground">
                Program schedule and timing details will be added here.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-xl font-semibold">Duration</h3>
              </div>
              <p className="text-muted-foreground">
                Program duration and session length details will be added here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#1E3A5F] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="mb-8">
            Join our transformative program and discover the healing power of 
            music and meditation. Take the first step towards inner harmony today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#1E3A5F] hover:bg-white/90"
            >
              Join Program
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
