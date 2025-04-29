import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to MindHarmony
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your journey to inner peace and well-being starts here.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/meditations"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Meditations
          </Link>
          <Link
            href="/concerts"
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            View Concerts
          </Link>
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
      <section className="w-full max-w-6xl py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/meditations"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Meditations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Guided meditation sessions for relaxation and mindfulness.
            </p>
          </Link>
          <Link
            href="/concerts"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Concerts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Live and recorded piano concerts for your enjoyment.
            </p>
          </Link>
          <Link
            href="/yoga"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Yoga
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yoga sessions for physical and mental well-being.
            </p>
          </Link>
          <Link
            href="/subscription"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Subscribe
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get access to all premium content and features.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
