import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/DSC03945.jpg"
          alt="Main header image"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Journey Within, Guided by Sound
        </h1>

        <p className="max-w-2xl text-white/90 mb-8 text-base md:text-lg">
          At Mind Harmony, we uplift your mind, awaken your heart, and empower
          your spirit through transformative musical experiences and
          piano-guided meditations. Step beyond the stress of everyday life and
          reclaim your inner clarity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-white text-[#1E3A5F] hover:bg-white/90 transition-all duration-300"
            asChild
          >
            <Link to="/events">Explore Events</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-[#1E3A5F] hover:bg-white/20 transition-all duration-300"
            asChild
          >
            <Link to="/meditations">Start Your Meditation Journey</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
