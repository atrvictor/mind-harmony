import EventCard from "@/polymet/components/event-card";
import { useState, useEffect, useRef } from "react";
import { getAllEvents } from "@/lib/eventsDB";
import { supabase } from "@/lib/supabase";
import type { EventDB } from "@/lib/eventsDB";

export default function VipReservePage() {
  const [septemberEvent, setSeptemberEvent] = useState<EventDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [soldOut, setSoldOut] = useState(false);
  const [reservationEventId, setReservationEventId] = useState<number | undefined>(undefined);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsVideoPlaying(true);
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  useEffect(() => {
    async function fetchSeptemberEvent() {
      try {
        const events = await getAllEvents();
        // Find the September 14th VIP event specifically (4:00 PM)
        const sep14Event = events.find(e => 
          (e.date.includes('Sep 14') || e.date.includes('September 14')) && 
          e.time === '4:00 PM' &&
          e.button !== 'Past Event'
        );
        
        setSeptemberEvent(sep14Event || null);

        // Map to legacy reservations event id for September 14th
        try {
          const { data: legacyEvents } = await supabase
            .from('events')
            .select('id, event_date, max_seats')
            .order('event_date', { ascending: true });
          
          if (legacyEvents && sep14Event) {
            // Find the September 14th 4PM VIP legacy event
            const septemberLegacy = legacyEvents.find(e => {
              if (!e.event_date || !e.event_date.includes('2025-09-14')) return false;
              const eventHour = new Date(e.event_date).getHours();
              return eventHour === 16; // 4PM
            });
            
            if (septemberLegacy?.id) {
              setReservationEventId(septemberLegacy.id);
              
              // Check if September event is sold out
              const { data: reservations } = await supabase
                .from('reservations')
                .select('seats')
                .eq('event_id', septemberLegacy.id);
                
              const totalReserved = reservations?.reduce((sum, res) => sum + res.seats, 0) || 0;
              const isSoldOut = totalReserved >= septemberLegacy.max_seats;
              setSoldOut(isSoldOut);
            }
          }
        } catch (e) {
          console.error('Error mapping to legacy event:', e);
        }
      } catch (error) {
        console.error('Failed to fetch September 14th event:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSeptemberEvent();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  if (!septemberEvent) {
    return <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center">
      <div>VIP event not found</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E5]/30">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/optimized/katesessions_landscape_6.jpg"
          alt="VIP Reserve Your Spot"
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">VIP Invitation</h1>
            <p className="max-w-3xl mx-auto text-xl mb-4">
              Join us for an intimate piano meditation experience designed especially for our Mount Soledad community. This exclusive gathering combines the tranquility of live piano music with guided meditation in the beautiful park setting.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-lg font-medium">
                September 14th, 2025 • 4:00 PM • Mount Soledad Memorial Park
              </p>
              <p className="text-sm mt-2 opacity-90">
                A special piano meditation experience in your neighborhood
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Experience Preview</h3>
            <p className="text-gray-600">Get a glimpse of what awaits you at Mount Soledad Memorial Park</p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black max-w-md mx-auto">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls={isVideoPlaying}
              onPause={handleVideoPause}
              onEnded={handleVideoPause}
              preload="metadata"
            >
              <source src="/IMG_2008.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Big Play Button Overlay */}
            {!isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={handleVideoPlay}
                  className="group bg-white/90 hover:bg-white rounded-full p-6 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Play video preview"
                >
                  <svg 
                    className="w-16 h-16 text-gray-800 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Click to play with sound • Experience the tranquil atmosphere of your neighborhood event
          </p>
        </div>
      </div>

      {/* VIP Event Section */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">          
          <div className="max-w-2xl mx-auto">
            <EventCard
              id={septemberEvent.id}
              title={septemberEvent.title}
              date={septemberEvent.date}
              time="4:00 PM" // VIP specific time
              location="Mount Soledad Memorial Park"
              description="An exclusive piano meditation experience for Mount Soledad neighbors and Boutique Luxury Living guests. Immerse yourself in the healing sounds of live piano music while enjoying guided meditation in the serene outdoor setting of Mount Soledad Memorial Park."
              image={septemberEvent.image}
              featured={true}
              getTicketsLink={septemberEvent.get_tickets_link}
              button="Reserve VIP Spot"
              forceReserve
              reservationEventId={reservationEventId}
              soldOut={soldOut}
            />
          </div>

          {/* VIP Benefits */}
          <div className="mt-16 bg-white/80 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">VIP Experience Includes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Exclusive Neighborhood Access</h4>
                  <p className="text-sm text-gray-600">Special invitation for Mount Soledad residents and Boutique Luxury Living guests</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Live Piano Meditation</h4>
                  <p className="text-sm text-gray-600">Immersive experience with Vitiá Kulish's original compositions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Intimate Setting</h4>
                  <p className="text-sm text-gray-600">Small group experience in the beautiful Mount Soledad Memorial Park</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Community Connection</h4>
                  <p className="text-sm text-gray-600">Connect with fellow neighbors in a peaceful, shared experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Questions about this VIP experience? Contact us at{" "}
              <a href="mailto:harmoniusmind@gmail.com" className="text-blue-600 hover:underline">
                harmoniusmind@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
