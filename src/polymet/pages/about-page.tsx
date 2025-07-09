import { Button } from "@/components/ui/button";
import { HeartIcon, MusicIcon } from "lucide-react";

export default function AboutPage() {
  // Named image sources for clarity
  const founderMainImage = "/victor-at-piano.webp"; // Victor playing piano
  const founderCornerImage = "/founder-corner-image.jpg"; // Corner image

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/glider port chad.png"
          alt="Gliderport Chad"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Discover the story behind Mind Harmony and our mission to
              transform lives through music and meditation.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-[#F5F0E5]/70 p-8 md:p-10 rounded-lg border border-[#F5F0E5] relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <div className="flex items-center gap-2">
                      <MusicIcon className="h-5 w-5 text-[#1E3A5F]" />

                      <HeartIcon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                <p className="text-lg italic text-[#1E3A5F] font-serif">
                  "At Mind Harmony, we uplift your mind, awaken your heart, and
                  empower your spirit through transformative musical experiences
                  and piano-guided meditations. We help you step beyond the
                  stress of everyday life, reclaim your inner clarity, and
                  unlock your ability to positively shape your world."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <img
                  src={founderMainImage}
                  alt="Victor Kulish, Founder of Mind Harmony"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-md hidden md:block">
                <img
                  src={founderCornerImage}
                  alt="Victor Kulish"
                  className="rounded w-[100px] h-[100px] object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Founder's Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  From his earliest days at the piano, music has been Victor Kulish's companion, healer, and guide. As a child, he found joy in playing for his grandmother, who became an endless source of encouragement and inspiration. In her later years, when her mobility was limited, Victor discovered the profound impact of his music—it brought her joy, comfort, and a deep sense of connection during their time together. This experience left an indelible mark on his understanding of music's ability to heal and uplift.
                </p>
                <p>
                  As Victor grew older, his passion for music blended seamlessly with his fascination for yoga, AcroYoga, and mindfulness practices. Immersing himself in these vibrant communities, he delved deeply into studying self-mastery, meditation, and personal growth. It became clear to him that combining piano music with mindful practices created a uniquely powerful pathway to inner peace and clarity.
                </p>
                <p>
                  Mind Harmony emerged naturally from this realization. Through candlelit yoga accompanied by live piano and piano-guided meditations, Victor discovered his purpose—helping others reconnect to themselves, soothe their minds, and awaken their inner strength. Many dear friends and participants have expressed profound appreciation for his compositions, affirming his belief in music's transformative power.
                </p>
                
                <h3 className="text-xl font-semibold pt-4">Victor's Vision</h3>
                <p className="italic">
                  "My vision for Mind Harmony is to create spaces and experiences where people feel completely at ease. I believe each of us carries an incredible spark within—a boundless potential for creativity and wonder. Mind Harmony is my way of helping others rediscover this spark, encouraging them to embrace life's endless possibilities and empowering them to shape their world for the better."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5F0F9] mb-4">
                <MusicIcon className="h-6 w-6 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Harmony</h3>
              <p className="text-muted-foreground">
                We believe in the power of harmony—both in music and in life.
                Our practices aim to bring your mind, body, and spirit into
                alignment.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F0E5] mb-4">
                <HeartIcon className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compassion</h3>
              <p className="text-muted-foreground">
                We approach every session and interaction with deep compassion,
                creating a safe space for personal growth and emotional healing.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5F0F9] mb-4">
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
                  className="h-6 w-6 text-[#1E3A5F]"
                >
                  <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                  <path d="M12 13v8"></path>
                  <path d="M12 3v3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transformation</h3>
              <p className="text-muted-foreground">
                We are committed to facilitating meaningful personal
                transformation through our unique approach to meditation and
                mindfulness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#F5F0E5]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src="/Vic.jpg"
                  alt="Victor Kulish"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold">Victor Kulish</h3>
              <p className="text-muted-foreground mb-2">
                Founder & Piano Meditation Guide
              </p>
              <p className="text-sm text-muted-foreground">
                Contemporary Pianist and Composer, a lover of mindfulness, meditation and yoga.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src="/Dom.jpg"
                  alt="Dominick Cole"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold">Dominick Cole</h3>
              <p className="text-muted-foreground mb-2">Yoga Instructor</p>
              <p className="text-sm text-muted-foreground">
                Certified yoga teacher specializing in restorative and yin
                practices.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src="/Masha.jpg"
                  alt="Masha Shenderovich"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold">Masha Shenderovich</h3>
              <p className="text-muted-foreground mb-2">
                Founder of Think Simpler & Juicy Kitchen
              </p>
              <p className="text-sm text-muted-foreground">
                A creative thinker and speaker, passionate about nourishing communities and inspiring love in people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#1E3A5F] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="mb-8">
            Experience the transformative power of Mind Harmony's approach to
            meditation and mindfulness. Join us for an upcoming event or
            session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#1E3A5F] hover:bg-white/90"
            >
              Explore Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-[#1E3A5F] hover:bg-white/20"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
