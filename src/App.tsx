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
import ProgramPage from "@/polymet/pages/program-page";
import JoinPage from "@/polymet/pages/join-page";
import ResetPasswordPage from "@/polymet/pages/reset-password";
import AdminSetupPage from "@/polymet/pages/admin-setup";
import LoginPage from "@/polymet/pages/login-page";
import AdminPage from "@/polymet/pages/admin";
import ReservePage from "@/polymet/pages/reserve-page";
import TermsOfServicePage from "@/polymet/pages/terms-of-service";
import PrivacyPolicyPage from "@/polymet/pages/privacy-policy";
import InvitationLandingPage from "@/polymet/pages/invitation-landing";
import MeditationDashboard from "@/polymet/pages/meditation-dashboard";

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
          <Route path="/reserve" element={
            <AuthenticatedLayout>
              <ReservePage />
            </AuthenticatedLayout>
          } />
          <Route path="/program" element={
            <AuthenticatedLayout>
              <ProgramPage />
            </AuthenticatedLayout>
          } />
          <Route path="/join" element={<JoinPage />} />
          
          {/* Legal pages */}
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          
          {/* Invitation flow */}
          <Route path="/invitation" element={<InvitationLandingPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected routes */}
          <Route path="/meditation" element={
            <ProtectedRoute>
              <MeditationDashboard />
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
