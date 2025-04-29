// app/concerts/page.tsx
// version: 1

import Link from "next/link";

export default function ConcertsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Introduction Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Concerts & Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the magic of live piano performances in intimate settings. Join us for unforgettable musical journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">June 15, 2024</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Evening of Piano Meditation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">An intimate evening of piano meditation and mindfulness</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">$35</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Book Tickets
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">July 20, 2024</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Summer Piano & Yoga</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">A unique combination of live piano and guided yoga</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">$45</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Book Tickets
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">August 10, 2024</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Piano Meditation Workshop</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Learn to incorporate piano meditation into your daily practice</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">$55</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">May 5, 2024</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Spring Piano Meditation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">A beautiful evening of piano meditation in the spring garden</p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Watch Highlights
              </button>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">April 12, 2024</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Piano & Yoga Retreat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">A day-long retreat combining piano meditation and yoga</p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Watch Highlights
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Info Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Book a Private Performance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Looking for a unique experience for your event? Book a private piano meditation performance.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Private Event Options</h3>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Corporate events and retreats
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Private gatherings and celebrations
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Wellness centers and yoga studios
                </li>
              </ul>
              <Link 
                href="/contact" 
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Contact for Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 