import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';

vi.mock('@/lib/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/UserNotRegisteredError', () => ({
  default: () => <div>Not registered</div>,
}));

function renderProtected(authState) {
  useAuth.mockReturnValue({
    checkUserAuth: vi.fn(),
    ...authState,
  });
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<ProtectedRoute unauthenticatedElement={<div>Login required</div>} />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading fallback while auth is checking', () => {
    renderProtected({ isLoadingAuth: true, authChecked: false, isAuthenticated: false, authError: null });
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders outlet when authenticated', () => {
    renderProtected({ isLoadingAuth: false, authChecked: true, isAuthenticated: true, authError: null });
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('shows unauthenticated element when not logged in', () => {
    renderProtected({ isLoadingAuth: false, authChecked: true, isAuthenticated: false, authError: null });
    expect(screen.getByText('Login required')).toBeInTheDocument();
  });

  it('shows registration error for unregistered users', () => {
    renderProtected({
      isLoadingAuth: false,
      authChecked: true,
      isAuthenticated: false,
      authError: { type: 'user_not_registered' },
    });
    expect(screen.getByText('Not registered')).toBeInTheDocument();
  });
});
