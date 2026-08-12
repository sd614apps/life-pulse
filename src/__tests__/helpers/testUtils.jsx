import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessibilityProvider } from '@/lib/AccessibilityContext';
import { LocaleProvider } from '@/lib/LocaleContext';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

export function renderWithProviders(ui, { route = '/', queryClient } = {}) {
  const qc = queryClient || createTestQueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <AccessibilityProvider>
        <LocaleProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </LocaleProvider>
      </AccessibilityProvider>
    </QueryClientProvider>,
  );
}
