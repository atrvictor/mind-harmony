import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useScrollZoom } from "@/hooks/useScrollZoom";
import { useEffect, useState } from "react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  featured?: boolean;
  getTicketsLink?: string;
}

export default function EventCard({
  title,
  date,
  time,
  description,
  image,
  featured = false,
  getTicketsLink,
}: EventCardProps) {
  const { containerRef, isActive } = useScrollZoom(featured ? 0.05 : 0.4);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (featured && isActive) {
      setZoomed(true);
      const timeout = setTimeout(() => {
        setZoomed(false);
      }, 1200); // 1.2 seconds at full zoom
      return () => clearTimeout(timeout);
    } else if (featured && !isActive) {
      setZoomed(false);
    }
  }, [featured, isActive]);

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md",
        featured ? "md:col-span-2" : ""
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden",
          featured ? "h-64 md:h-80" : "h-48"
        )}
      >
        <img
          src={image}
          alt={title}
          className={cn(
            featured
              ? "h-full w-full object-cover transition-transform duration-700"
              : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110 group-active:scale-110",
            featured
              ? zoomed
                ? "scale-125"
                : "group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
              : isActive
              ? "scale-105"
              : ""
          )}
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
            {title === "Candlelight Yoga and Piano"
              ? `${date} • ${time} • La Jolla`
              : `${date} • ${time}`}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {getTicketsLink ? (
          <a
            href={getTicketsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block"
          >
            <Button className="w-full">Get Tickets</Button>
          </a>
        ) : (
          <Button className="w-full" disabled>Coming Soon</Button>
        )}
      </div>
    </div>
  );
}

// Helper function to conditionally join classNames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
