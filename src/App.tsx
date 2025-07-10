// The simplest possible app to isolate the issue
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Import all original page components
import MainLayout from "@/polymet/layouts/main-layout";
import HomePage from "@/polymet/pages/home-page";
import EventsPage from "@/polymet/pages/events-page";
import AboutPage from "@/polymet/pages/about-page";
import MeditationsPage from "@/polymet/pages/meditations-page";
import ContactPage from "@/polymet/pages/contact-page";
import PricingPage from "@/polymet/pages/pricing-page";
import ProfilePage from "@/polymet/pages/profile-page";
import AdminSetupPage from "@/polymet/pages/admin-setup";
import LoginPage from "@/polymet/pages/login-page";
import AdminPage from "@/polymet/pages/admin";

// User Profile button component that can be added to navigation
function UserProfileButton() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button 
        onClick={async () => {
          await signOut();
          navigate('/');
        }}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #1E3A5F',
          color: '#1E3A5F',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

// Meditation Dashboard for authenticated users
function MeditationDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user?.email}
      </h1>
      <article className="prose max-w-none mb-10">
        <h2>Grounding Breath Meditation</h2>
        <p>
          Find a comfortable seated position. Close your eyes and take a deep
          breath in through your nose, allowing your abdomen to expand. Slowly
          exhale through your mouth, releasing any tension. Continue this
          gentle breathing, focusing on the sensation of air entering and
          leaving your body. If your mind wanders, gently redirect your
          attention back to your breath.
        </p>
        <p>
          After a few minutes, allow the piano music below to guide you deeper
          into relaxation.
        </p>
      </article>

      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/2OEL4P1Rz04"
          title="Piano Meditation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

// Add Auth Status component for debugging
function AuthStatus() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}
    >
      Logged in as: {user.email}
    </div>
  );
}

// AuthenticatedLayout that connects AuthProvider to MainLayout
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <MainLayout user={user}>
      {children}
    </MainLayout>
  );
}

// Main App Component
export default function MindHarmonyPrototype() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
          {/* Regular routes */}
          <Route path="/" element={
            <AuthenticatedLayout>
              <HomePage />
            </AuthenticatedLayout>
          } />
          <Route path="/events" element={
            <AuthenticatedLayout>
              <EventsPage />
            </AuthenticatedLayout>
          } />
          <Route path="/about" element={
            <AuthenticatedLayout>
              <AboutPage />
            </AuthenticatedLayout>
          } />
          <Route path="/meditations" element={
            <AuthenticatedLayout>
              <MeditationsPage />
            </AuthenticatedLayout>
          } />
          <Route path="/contact" element={
            <AuthenticatedLayout>
              <ContactPage />
            </AuthenticatedLayout>
          } />
          <Route path="/harmonize" element={
            <AuthenticatedLayout>
              <PricingPage />
            </AuthenticatedLayout>
          } />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/meditation" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MeditationDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          {/* Profile page without nested layouts */}
          <Route path="/profile" element={
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          } />
          
          {/* Admin setup page without nested layouts */}
          <Route path="/admin/setup" element={
            <MainLayout user={null}>
              <AdminSetupPage />
            </MainLayout>
          } />
          
          {/* Admin page route */}
          <Route path="/admin" element={
            <AuthenticatedLayout>
              <AdminPage />
            </AuthenticatedLayout>
          } />
      </Routes>
        
        <AuthStatus />
      </AuthProvider>
    </Router>
  );
}
