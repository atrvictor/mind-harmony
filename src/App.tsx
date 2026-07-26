// The simplest possible app to isolate the issue
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminEventReservations from "@/polymet/pages/admin-event-reservations";
import ReservePage from "@/polymet/pages/reserve-page";
import RsvpPage from "@/polymet/pages/rsvp-page";
import VipReservePage from "@/polymet/pages/vip-reserve-page";
import TermsOfServicePage from "@/polymet/pages/terms-of-service";
import PrivacyPolicyPage from "@/polymet/pages/privacy-policy";
import InvitationLandingPage from "@/polymet/pages/invitation-landing";
import MeditationDashboard from "@/polymet/pages/meditation-dashboard";
import FriendGiftPage from "@/polymet/pages/friend-gift-page";
import ErrorBoundary from "@/polymet/components/error-boundary";



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
        padding: '3px 6px',
        borderRadius: '3px',
        fontSize: '8px',
        zIndex: 9999,
        transform: 'scale(0.5)',
        transformOrigin: 'bottom right'
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
      <ErrorBoundary>
      <Routes>
          {/* RSVP route */}
          <Route path="/rsvp" element={
            <AuthenticatedLayout>
              <RsvpPage />
            </AuthenticatedLayout>
          } />
          
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
          <Route path="/vip" element={
            <AuthenticatedLayout>
              <VipReservePage />
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
          <Route path="/friend" element={
            <AuthenticatedLayout>
              <FriendGiftPage />
            </AuthenticatedLayout>
          } />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected routes */}
          <Route path="/welcome" element={
            <AuthenticatedLayout>
              <MeditationDashboard />
            </AuthenticatedLayout>
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
          <Route path="/admin/eventreservations" element={
            <AuthenticatedLayout>
              <AdminEventReservations />
            </AuthenticatedLayout>
          } />
          
      </Routes>
      </ErrorBoundary>
        
        <AuthStatus />
      </AuthProvider>
    </Router>
  );
}
