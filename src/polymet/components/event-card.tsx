import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useScrollZoom } from "@/hooks/useScrollZoom";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { submitReservation } from "@/lib/submitReservation";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  location?: string;
  featured?: boolean;
  getTicketsLink?: string;
  suppressFeaturedLayout?: boolean;
  button?: string; // Add button prop
  forceReserve?: boolean; // Force reservation flow (used on Reserve page)
  reservationEventId?: number; // Use a specific reservation event (legacy seats table)
  soldOut?: boolean; // If true, show "Guest List Full"
}

export default function EventCard({
  id,
  title,
  date,
  time,
  description,
  image,
  location,
  featured = false,
  getTicketsLink,
  suppressFeaturedLayout = false,
  button,
  forceReserve = false,
  reservationEventId,
  soldOut = false,
}: EventCardProps) {
  const { containerRef, isActive } = useScrollZoom(!suppressFeaturedLayout && featured ? 0.05 : 0.4);
  const [zoomed, setZoomed] = useState(false);
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    seats: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!suppressFeaturedLayout && featured && isActive) {
      setZoomed(true);
      const timeout = setTimeout(() => {
        setZoomed(false);
      }, 1200); // 1.2 seconds at full zoom
      return () => clearTimeout(timeout);
    } else if (!suppressFeaturedLayout && featured && !isActive) {
      setZoomed(false);
    }
  }, [featured, isActive, suppressFeaturedLayout]);

  // Removed automatic donation calculation - users can enter any amount they wish

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "donation") {
      // Handle donation field - can be empty string or number
      setForm((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: name === "seats" ? Number(value) : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const res = await submitReservation({
      eventId: reservationEventId ?? id,
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      seats: form.seats,
      donation: undefined,
      eventName: title,
      eventDate: date,
      eventLocation: location,
      eventTime: time,
    });
    setResult(res);
    setSubmitting(false);
    if (res.success) {
      setForm({ name: "", email: "", phone: "", seats: 1 });
      setOpen(false); // Close the reservation modal
      setSuccessOpen(true); // Open the success dialog
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate('/'); // Navigate to main page
  };

  // Show reservation modal
  // - If forceReserve, always show (Reserve page)
  // - Otherwise, show when not marked as Past/Coming Soon and there's no external tickets link
  const showReserve = (forceReserve && !soldOut) || (!forceReserve && (button !== 'Past Event' && button !== 'Coming Soon') && !getTicketsLink && !soldOut);

  // Only apply special layout if not suppressed
  const cardClass = cn(
    "group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md",
    !suppressFeaturedLayout && featured ? "md:col-span-2" : ""
  );
  const imageClass = cn(
    !suppressFeaturedLayout && featured
      ? "h-full w-full object-cover transition-transform duration-700"
      : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110 group-active:scale-110",
    !suppressFeaturedLayout && featured
      ? zoomed
        ? "scale-125"
        : "group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
      : isActive
      ? "scale-105"
      : ""
  );

  return (
    <div className={cardClass}>
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden",
          !suppressFeaturedLayout && featured ? "h-64 md:h-80" : "h-48"
        )}
      >
        <img
          src={image}
          alt={title}
          className={imageClass}
        />

        {featured && (
          <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
            Featured Event
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarIcon size={16} />

          <span>
            {location
              ? `${date} • ${time} • ${location}`
              : title === "Candlelight Yoga and Piano"
              ? `${date} • ${time} • La Jolla`
              : `${date} • ${time}`}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {soldOut ? (
          <Button className="w-full bg-black text-red-500 hover:bg-black cursor-not-allowed" disabled>
            Guest List Full
          </Button>
        ) : button === "Past Event" ? (
          <Button className="w-full" disabled>
            Past Event
          </Button>
        ) : button === "Coming Soon" ? (
          <Button className="w-full" disabled>
            Coming Soon
          </Button>
        ) : (!forceReserve && getTicketsLink && !soldOut) ? (
          <a
            href={getTicketsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block"
          >
            <Button className="w-full">Get Tickets</Button>
          </a>
        ) : showReserve ? (
          <>
            <Button className="w-full" onClick={() => setOpen(true)}>
              Reserve Your Spot
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogTitle>Reserve Your Spot</DialogTitle>
                {/* Event Info at the top */}
                <div className="mb-4">
                  <div className="font-semibold text-lg">{title}</div>
                  <div className="text-sm text-muted-foreground mb-1">{date} • {time}{location ? ` • ${location}` : ""}</div>
                  {location === "Palisades South Park" && (
                    <div className="text-sm text-muted-foreground mb-2">4960 Ocean Blvd, San Diego, CA, 92109</div>
                  )}
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Seats</label>
                    <input
                      type="number"
                      name="seats"
                      min={1}
                      max={10}
                      value={form.seats}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Contribution (optional)</label>
                    <p className="text-xs text-muted-foreground mt-1">
                      We suggest $20–$40 per seat. Your support helps us continue these events, but no one is turned away for lack of funds. In your email confirmation you will receive a link to our Venmo. Thank you for your support!
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Reservation"}
                  </Button>
                  {result && !result.success && (
                    <p className="text-red-600 text-sm mt-2">{result.error || "Reservation failed. Please try again."}</p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </>
        ) : null}
      </div>
      
      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-md">
          <DialogTitle>Reservation Confirmed!</DialogTitle>
          <div className="text-center py-4">
            <p className="text-green-600 font-medium mb-2">Reservation successful!</p>
            <p className="text-sm text-muted-foreground">Check your email for confirmation.</p>
          </div>
          <Button onClick={handleSuccessClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to conditionally join classNames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
