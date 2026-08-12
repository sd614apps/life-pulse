import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/landing/Hero';
import SecurityBanner from '@/components/landing/SecurityBanner';
import FeatureGrid from '@/components/landing/FeatureGrid';
import Testimonials from '@/components/landing/Testimonials';
import SiteFooter from '@/components/landing/SiteFooter';

export default function Landing() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const createAccount = () => navigate('/register');
  const signIn = () => navigate('/login');

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onSignIn={signIn} authLabel="Sign In" />
      <main id="security">
        <Hero
          onGetStarted={createAccount}
          onSignIn={signIn}
          primaryLabel="Create Account"
          secondaryLabel="Sign In"
        />
        <SecurityBanner />
        <FeatureGrid />
        <div id="stories">
          <Testimonials />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}