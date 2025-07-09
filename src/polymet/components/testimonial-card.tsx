import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title?: string;
  avatarSrc?: string;
}

export default function TestimonialCard({
  quote,
  name,
  title,
  avatarSrc,
}: TestimonialCardProps) {
  // Get initials for avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
      <QuoteIcon className="h-8 w-8 text-[#D4AF37] mb-4 opacity-70" />

      <blockquote className="mb-6 text-muted-foreground">"{quote}"</blockquote>

      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3 border border-[#E5F0F9]">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div>
          <div className="font-medium">{name}</div>
          {title && (
            <div className="text-sm text-muted-foreground">{title}</div>
          )}
        </div>
      </div>
    </div>
  );
}
