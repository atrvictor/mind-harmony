import FixedNavigationMenu from "@/polymet/components/fixed-navigation-menu";
import Footer from "@/polymet/components/footer";
import { MusicIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface MainLayoutProps {
  children: ReactNode;
  user: User | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  // Add a state to track scroll position 
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    // Function to update scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initialize scroll position
    handleScroll();
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Calculate opacity based on scroll position
  // Start with higher opacity, then reduce as user scrolls down
  const headerOpacity = Math.max(0.4, 0.95 - (scrollPosition * 0.001));
  
  // Increase shadow as opacity decreases
  const shadowClass = scrollPosition > 100 ? "shadow-lg" : "shadow-md";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background overflow-hidden">
      {/* Use inline style for background opacity based on scroll position */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[9999] w-full border-b backdrop-blur-md ${shadowClass} transition-all duration-200`}
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          // For dark mode handled via CSS variables
          '--header-opacity': headerOpacity.toString()
        } as React.CSSProperties}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 pl-8 hover:opacity-80 transition-opacity">
            <img src="/Lotus Piano Logo.png" alt="Mind Harmony Logo" className="h-14 w-14 object-contain" />

            <span className="text-xl font-bold text-[#1E3A5F] dark:text-foreground">
              Mind{' '}
              <span className="bg-gradient-to-r from-[#93c7ee] via-[#f3b6d3] to-[#ffd1b3] text-transparent bg-clip-text font-bold" style={{ filter: 'brightness(1.07)' }}>
                Harmony
              </span>
            </span>
          </Link>
          <FixedNavigationMenu user={user} />
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pt-20">{children}</main>

      <Footer />
    </div>
  );
}
