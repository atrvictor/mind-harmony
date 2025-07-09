import { Button } from "@/components/ui/button";
import { HeartIcon, MusicIcon } from "lucide-react";

export default function AboutSection() {
  // Named image sources for clarity
  const founderMainImage = "/victor-at-piano.webp"; // Victor playing piano
  const founderCornerImage = "/founder-corner-image.jpg"; // Corner image
  
  return (
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
                and piano-guided meditations. We help you step beyond the stress
                of everyday life, reclaim your inner clarity, and unlock your
                ability to positively shape your world."
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={founderMainImage}
                alt="Victor Kulish at the piano"
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
            <Button className="mt-6">Learn More About Us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
