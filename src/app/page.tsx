import Link from "next/link";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Particles Background */}
      <div className="fixed inset-0 -z-10">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "#ffffff" : "#000000"}
          refresh
        />
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to MindHarmony
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find your inner peace through the power of piano meditation and mindful movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/meditations"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Meditations
              </Link>
              <Link
                href="/concerts"
                className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                View Concerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="w-full max-w-6xl py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Featured Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured Meditation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Morning Meditation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start your day with this calming 10-minute meditation session.
              </p>
              <Link
                href="/meditations/morning"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Listen Now →
              </Link>
            </div>
          </div>

          {/* Featured Concert */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Piano Concert
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Experience the soothing melodies of our latest piano concert.
              </p>
              <Link
                href="/concerts/piano"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Watch Now →
              </Link>
            </div>
          </div>

          {/* Featured Yoga Session */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yoga Flow
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join our guided yoga session for a complete mind-body experience.
              </p>
              <Link
                href="/yoga/flow"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Start Practice →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="w-full bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              href="/meditations"
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Meditations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore our collection of piano meditation sessions.
              </p>
            </Link>
            <Link
              href="/concerts"
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Concerts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience live piano meditation performances.
              </p>
            </Link>
            <Link
              href="/yoga"
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yoga
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Combine piano meditation with mindful movement.
              </p>
            </Link>
            <Link
              href="/subscription"
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Subscribe
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get unlimited access to all our content.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
