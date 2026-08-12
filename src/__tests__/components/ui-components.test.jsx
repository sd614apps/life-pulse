import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('UI components', () => {
  describe('Button', () => {
    it('renders with default variant', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('supports disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive');
    });
  });

  describe('Badge', () => {
    it('renders badge text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('applies outline variant', () => {
      render(<Badge variant="outline">Tag</Badge>);
      expect(screen.getByText('Tag')).toHaveClass('text-foreground');
    });
  });

  describe('Card', () => {
    it('renders card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Body content</CardContent>
        </Card>,
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });
  });
});
