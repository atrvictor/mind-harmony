// app/components/Navigation.tsx
// version: 1

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            MindHarmony
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/meditations" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Meditations
            </Link>
            <Link 
              href="/concerts" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Concerts
            </Link>
            <Link 
              href="/yoga" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Yoga
            </Link>
            <Link 
              href="/subscription" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Subscribe
            </Link>
          </div>

          <div className="md:hidden">
            {/* Mobile menu button - will be implemented later */}
            <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 