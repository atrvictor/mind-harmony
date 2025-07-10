import { MusicIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitNewsletterEmail } from "@/lib/submitEmail";

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/favicon_256x256_rounded.png" alt="Mind Harmony Logo" className="h-8 w-8 object-contain" />

              <span className="text-xl font-bold">
                Mind{' '}
                <span className="bg-gradient-to-r from-[#7ecbff] via-[#f7b2e6] to-[#ff5e62] text-transparent bg-clip-text font-bold" style={{ filter: 'brightness(1.15)' }}>
                  Harmony
                </span>
              </span>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              Transforming lives through the unique combination of piano music
              and mindfulness practices.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-white/80 transition-colors"
                aria-label="Facebook"
              >
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-white/80 transition-colors"
                aria-label="Instagram"
              >
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-white/80 transition-colors"
                aria-label="Twitter"
              >
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/meditations"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Meditations
                </Link>
              </li>
              <li>
                <Link
                  to="/harmonize"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Harmonize
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Meditation Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Piano Compositions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4">
              Subscribe to receive updates on new events, meditations, and
              special offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Mind Harmony. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await submitNewsletterEmail(email);
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full px-3 py-2 text-sm text-foreground bg-white rounded-md"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === "loading" || status === "success"}
      />
      <Button
        type="submit"
        className="w-full bg-[#D4AF37] hover:bg-[#C4A027] text-white"
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Submitting..." : status === "success" ? "Thank You!" : "Subscribe"}
      </Button>
      {status === "success" && (
        <p className="text-green-200 text-xs">Thank you for subscribing!</p>
      )}
      {status === "error" && (
        <p className="text-red-200 text-xs">There was an error. Please try again.</p>
      )}
    </form>
  );
}
