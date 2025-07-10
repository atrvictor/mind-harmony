import ContactForm from "@/polymet/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  MessageCircleIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/katesessions_landscape_woman_left_1.jpg"
          alt="Kate Sessions Park with woman on left"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="max-w-2xl mx-auto text-lg">
              We'd love to hear from you. Reach out with any questions about our
              events, meditation sessions, or collaborations.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about Mind Harmony's events or meditation
                sessions? Want to collaborate or book a private session? We're
                here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E5F0F9] p-3 rounded-full">
                    <MailIcon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      <a
                        href="mailto:harmoniusmind@gmail.com"
                        className="hover:text-primary"
                      >
                        harmoniusmind@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E5F0F9] p-3 rounded-full">
                    <PhoneIcon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+16194948293" className="hover:text-primary">
                        +1 (619) 494-8293
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available Monday-Friday, 9am-5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E5F0F9] p-3 rounded-full">
                    <MessageCircleIcon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      WhatsApp Community
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Join our community for updates and discussions.
                    </p>
                    <Button className="flex items-center gap-2" asChild>
                      <a href="https://chat.whatsapp.com/FaasXEnmmEsEMlrNp0oE65" target="_blank" rel="noopener noreferrer">
                      <MessageCircleIcon size={18} />
                      <span>Join WhatsApp Group</span>
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E5F0F9] p-3 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Event Locations
                    </h3>
                    <p className="text-muted-foreground">
                      Our events are held at various locations throughout the
                      city. Check our events page for specific venue details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-[#E5F0F9] p-3 rounded-full hover:bg-[#1E3A5F] hover:text-white transition-colors"
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
                    className="bg-[#E5F0F9] p-3 rounded-full hover:bg-[#1E3A5F] hover:text-white transition-colors"
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
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#E5F0F9] p-3 rounded-full hover:bg-[#1E3A5F] hover:text-white transition-colors"
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
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                How can I book a private session?
              </h3>
              <p className="text-muted-foreground">
                You can request a private session by filling out our contact
                form or emailing us directly at harmoniusmind@gmail.com with your
                preferred dates and details.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                Do you offer corporate wellness programs?
              </h3>
              <p className="text-muted-foreground">
                Yes, we offer specialized programs for corporate clients. Please
                contact us for more information about bringing Mind Harmony to
                your workplace.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50">
              <h3 className="text-xl font-semibold mb-2">
                How can I collaborate with Mind Harmony?
              </h3>
              <p className="text-muted-foreground">
                We're always open to collaborations with like-minded individuals
                and organizations. Please reach out with your ideas and we'll be
                happy to discuss potential partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
