import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to MindHarmony
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience the perfect blend of piano meditations, concerts, and yoga sessions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/meditations" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Meditations
              </Link>
              <Link 
                href="/concerts" 
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                View Concerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Featured Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured items will be added here */}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="w-full bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link 
              href="/meditations" 
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Meditations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Piano meditation sessions</p>
            </Link>
            <Link 
              href="/concerts" 
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Concerts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Live performances</p>
            </Link>
            <Link 
              href="/yoga" 
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Yoga</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Yoga sessions</p>
            </Link>
            <Link 
              href="/subscription" 
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subscribe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Join our community</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
