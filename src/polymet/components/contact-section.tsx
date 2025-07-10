import ContactForm from "@/polymet/components/contact-form";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
            <p className="text-muted-foreground mb-8">
              Join our community of mindfulness seekers and be the first to know
              about upcoming events, meditation sessions, and exclusive content.
            </p>

            <div className="mb-8">
              <img
                src="/gliderport_landscape_2.jpg"
                alt="Mind Harmony community at Gliderport"
                className="rounded-lg w-full h-auto"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Join our WhatsApp Community
                </h3>
                <p className="text-muted-foreground mb-4">
                  Connect with like-minded individuals and receive updates
                  directly to your phone.
                </p>
                <Button className="flex items-center gap-2">
                  <MessageCircleIcon size={18} />

                  <span>Join WhatsApp Group</span>
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  Our events are held at various locations throughout the city.
                  Check our events page for specific venue details.
                </p>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
