// app/yoga/page.tsx
// version: 1

import Link from "next/link";

export default function YogaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Introduction Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Piano & Yoga
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the perfect harmony of piano meditation and yoga. Our unique sessions combine the power of music with mindful movement.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              The Power of Piano & Yoga
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Piano Meditation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Live piano music creates a serene atmosphere, helping you achieve deeper states of relaxation and mindfulness during your practice.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Yoga Practice</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gentle yoga movements flow naturally with the music, creating a unique experience that nourishes both body and mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Schedule Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Class Schedule
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-600">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Morning Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sunrise Flow</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">6:00 AM - 7:00 AM</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Book
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Morning Meditation</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">8:00 AM - 9:00 AM</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Evening Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sunset Flow</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">6:00 PM - 7:00 PM</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Book
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Evening Relaxation</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">8:00 PM - 9:00 PM</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-up Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Start your journey to inner peace and physical well-being with our piano and yoga sessions.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Membership Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Single Class</h4>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$25</p>
                  <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      One 60-minute session
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Live piano meditation
                    </li>
                  </ul>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Monthly Pass</h4>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$150</p>
                  <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      8 sessions per month
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority booking
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Access to recordings
                    </li>
                  </ul>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 