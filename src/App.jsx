import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { useLocation, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from '@/lib/AccessibilityContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Health from '@/pages/Health';
import Family from '@/pages/Family';
import Finance from '@/pages/Finance';
import Investments from '@/pages/Investments';
import Travel from '@/pages/Travel';
import TripDetail from '@/pages/TripDetail';
import Vault from '@/pages/Vault';
import Security from '@/pages/Security';
import AdminLogin from '@/pages/AdminLogin';
import Admin from '@/pages/Admin';
import AdminChangePassword from '@/pages/AdminChangePassword';
import FamilySettings from '@/pages/FamilySettings';
import Onboarding from '@/pages/Onboarding';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LocaleProvider } from '@/lib/LocaleContext';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import AppLayout from '@/components/AppLayout';
import Profile from '@/pages/Profile';
import Contact from '@/pages/Contact';
import Assistant from '@/pages/Assistant';
// Add page imports here

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/terms', '/privacy'];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);

  // Public pages (landing + auth) render without the auth gate
  if (!isPublicPath && (isLoadingPublicSettings || isLoadingAuth)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors only for protected (non-public) pages
  if (!isPublicPath && authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/family" element={<Family />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/investment" element={<Investments />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel/:id" element={<TripDetail />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/security" element={<Security />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/admin/system" element={<Admin />} />
          <Route path="/admin-change-password" element={<AdminChangePassword />} />
          <Route path="/settings/family" element={<FamilySettings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/finances" element={<Finance />} />
          <Route path="/investments" element={<Investments />} />
        </Route>
      </Route>
      {/* Add your page Route elements here */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <AccessibilityProvider>
        <LocaleProvider>
          <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
          </QueryClientProvider>
        </LocaleProvider>
      </AccessibilityProvider>
    </AuthProvider>
  )
}

export default App