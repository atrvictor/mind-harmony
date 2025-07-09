import HeroSection from "@/polymet/components/hero-section";
import EventsSection from "@/polymet/components/events-section";
import MeditationTeaser from "@/polymet/components/meditation-teaser";
import TestimonialsSection from "@/polymet/components/testimonials-section";
import AboutSection from "@/polymet/components/about-section";
import ContactSection from "@/polymet/components/contact-section";
import FloatingBackgroundElements from "@/polymet/components/floating-background-elements";
import AnimatedTreeOfLife from "@/polymet/components/animated-tree-of-life";
import HebrewLetterAnimation from "@/polymet/components/hebrew-letter-animation";
import MysticalBackground from "@/polymet/components/mystical-background";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let scrolled = false;
    function stopAutoScroll() {
      if (autoScrollTimeout.current) {
        clearTimeout(autoScrollTimeout.current);
      }
      scrolled = true;
      window.removeEventListener("mousemove", stopAutoScroll);
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("keydown", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
    }
    window.addEventListener("mousemove", stopAutoScroll);
    window.addEventListener("wheel", stopAutoScroll);
    window.addEventListener("keydown", stopAutoScroll);
    window.addEventListener("touchstart", stopAutoScroll);
    autoScrollTimeout.current = setTimeout(() => {
      if (!scrolled) {
        const el = document.getElementById("candlelight-yoga");
        if (el) {
          const startY = window.scrollY;
          const endY = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + el.offsetHeight / 2;
          const duration = 2000;
          let startTime: number | null = null;
          function animateScroll(currentTime: number) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, startY + (endY - startY) * ease);
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          }
          requestAnimationFrame(animateScroll);
        }
      }
    }, 1200);
    return () => {
      stopAutoScroll();
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Mystical Background */}
      <div className="relative overflow-hidden">
        <HeroSection />

        <div className="absolute inset-0 pointer-events-none">
          <MysticalBackground
            primaryColor="#F5F0E5"
            secondaryColor="#D4AF37"
            density={5} // Reduced density for fewer particles
          />
        </div>
      </div>

      {/* Events Section with Floating Elements */}
      <div className="relative overflow-hidden">
        <EventsSection />

        <FloatingBackgroundElements
          color="#F5F0E5"
          count={8} // Increased count
          className="opacity-30"
          fullWidth={true} // Use full width
          extendDown={true} // Extend elements lower
        />
      </div>

      {/* Meditation Teaser with Tree of Life */}
      <div className="relative">
        <MeditationTeaser />

        <div className="absolute inset-0 flex items-center justify-center mt-20 lg:mt-32 opacity-20 pointer-events-none">
          <AnimatedTreeOfLife
            color="#1E3A5F"
            accentColor="#D4AF37"
            size="lg"
            className="w-[600px] h-[900px]"
          />
        </div>
      </div>

      {/* Testimonials Section with Hebrew Letters */}
      <div className="relative overflow-hidden">
        <TestimonialsSection />

        {/* Added floating elements to testimonials section */}
        <FloatingBackgroundElements
          color="#D4AF37"
          count={6}
          className="opacity-20"
          fullWidth={true}
        />
      </div>

      {/* About Section with Floating Elements */}
      <div className="relative overflow-hidden">
        <AboutSection />

        <FloatingBackgroundElements
          color="#D4AF37"
          count={8} // Increased count
          className="opacity-20"
          fullWidth={true} // Use full width
          extendDown={true} // Extend elements lower
        />
      </div>

      {/* Contact Section with subtle background */}
      <div className="relative overflow-hidden">
        <ContactSection />

        {/* Added mystical background to contact section */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <MysticalBackground
            primaryColor="#F5F0E5"
            secondaryColor="#D4AF37"
            density={3} // Very subtle density
          />
        </div>
      </div>
    </div>
  );
}
