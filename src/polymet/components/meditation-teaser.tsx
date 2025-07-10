import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MusicIcon } from "lucide-react";
import { useState } from "react";
import { submitEmail } from "@/lib/submitEmail";

export default function MeditationTeaser() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await submitEmail(email);
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#E5F0F9] text-[#1E3A5F] px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <MusicIcon size={16} />

                <span>Coming Soon</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Guided Meditation Platform
              </h2>
              <p className="text-muted-foreground mb-6">
                Our interactive meditation platform is currently in development.
                Sign up below to be the first to know when we launch and receive
                exclusive early access to our piano-guided meditations.
              </p>
            </div>

            <div className="bg-[#F5F0E5]/50 p-6 rounded-lg border border-[#F5F0E5] mb-6">
              <h3 className="font-medium mb-2">What to expect:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#E5F0F9] p-1 mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1E3A5F]"></span>
                  </span>
                  <span>Personalized meditation recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#E5F0F9] p-1 mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1E3A5F]"></span>
                  </span>
                  <span>Piano-guided meditation sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#E5F0F9] p-1 mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1E3A5F]"></span>
                  </span>
                  <span>Self-reflection worksheets</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#E5F0F9] p-1 mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1E3A5F]"></span>
                  </span>
                  <span>Progress tracking</span>
                </li>
              </ul>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                />

                <Button type="submit" disabled={status === "loading" || status === "success"}>
                  {status === "loading" ? "Submitting..." : status === "success" ? "Thank You!" : "Notify Me"}
                </Button>
              </div>
              {status === "success" && (
                <p className="text-green-600 text-sm">Thank you! You're on the list.</p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm">There was an error. Please try again.</p>
              )}
              <p className="text-xs text-muted-foreground">
                We respect your privacy and will never share your information.
              </p>
            </form>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <img
                src="/nature_river_rocks_focused_deep_creek_style_2.jpg"
                alt="Piano meditation preview"
                className="object-cover w-full h-full"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-medium mb-2">Featured Meditation</p>
                <h3 className="text-xl font-bold">Clarity Through Sound</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
