// app/meditations/page.tsx
// version: 1

import Link from "next/link";

export default function MeditationsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Introduction Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Piano Meditations
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the transformative power of piano meditation. Each session is carefully crafted to help you find inner peace and mental clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Free Samples Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Free Samples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample meditation cards will be added here */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Morning Serenity</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Start your day with peace and clarity</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Play Sample
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Evening Reflection</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Wind down with gentle melodies</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Play Sample
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deep Focus</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Enhance concentration and productivity</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Play Sample
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Details Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Full Access Subscription
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get unlimited access to all meditation sessions, exclusive content, and new releases.
            </p>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">$19.99/month</h3>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited access to all meditation sessions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  New content added monthly
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Download for offline listening
                </li>
              </ul>
              <Link 
                href="/subscription" 
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Listeners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &ldquo;These piano meditations have become an essential part of my daily routine. The music is incredibly soothing and helps me find my center.&rdquo;
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">- Sarah M.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &ldquo;I&apos;ve tried many meditation apps, but nothing compares to the depth and quality of these piano sessions. Truly transformative.&rdquo;
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">- Michael R.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &ldquo;The combination of beautiful piano music and guided meditation is perfect. I feel more relaxed and focused after each session.&rdquo;
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">- Emily T.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 