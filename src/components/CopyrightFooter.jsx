import React from 'react';
import { Link } from 'react-router-dom';

export default function CopyrightFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} LifePulse. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/contact" className="hover:text-foreground">Support</Link>
        </div>
      </div>
    </footer>
  );
}