import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAccessibility } from '@/lib/AccessibilityContext';
import {
  Activity, Type, Contrast, EyeOff, ChevronDown, LogOut, Check,
  ShieldCheck, FileText, Globe, Lock, User, HelpCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import RegionUnitsModal from '@/components/settings/RegionUnitsModal';

function MiniToggle({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        active ? 'border-brand bg-brand/10 text-brand' : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default function DashboardHeader() {
  const navigate = useNavigate();
  const {
    largeText, toggleLargeText,
    highContrast, toggleHighContrast,
    privacyMode, togglePrivacyMode,
    setLargeText,
  } = useAccessibility();
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(() => localStorage.getItem('lp-active-profile'));
  const [regionOpen, setRegionOpen] = useState(false);

  useEffect(() => {
    base44.entities.Profile.list().then((items) => {
      setProfiles(items || []);
      if ((!activeId || !items.find((p) => p.id === activeId)) && items.length) {
        setActiveId(items[0].id);
        localStorage.setItem('lp-active-profile', items[0].id);
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeId);

  const switchProfile = (p) => {
    setActiveId(p.id);
    localStorage.setItem('lp-active-profile', p.id);
    if (p.view_mode === 'simplified') setLargeText(true);
  };

  const signOut = () => base44.auth.logout('/');

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <span className="hidden font-heading text-xl font-semibold text-foreground sm:block">LifePulse</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border/70 bg-card px-3 text-sm font-medium text-foreground hover:border-brand/40">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: activeProfile?.avatar_color || 'hsl(174 58% 39%)' }}
                >
                  {activeProfile?.display_name?.charAt(0) || '?'}
                </span>
                <span className="hidden max-w-[150px] truncate sm:inline">
                  {activeProfile?.tier_label || 'Switch profile'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Family profiles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profiles.map((p) => (
                <DropdownMenuItem key={p.id} onSelect={() => switchProfile(p)} className="gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: p.avatar_color }}
                  >
                    {p.display_name?.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.tier_label}</div>
                    <div className="text-xs text-muted-foreground">{p.view_mode} view</div>
                  </div>
                  {activeId === p.id && <Check className="h-4 w-4 text-brand" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <MiniToggle active={largeText} onClick={toggleLargeText} icon={Type} label="Large Text Mode" />
          <MiniToggle active={highContrast} onClick={toggleHighContrast} icon={Contrast} label="High Contrast Mode" />
          <MiniToggle active={privacyMode} onClick={togglePrivacyMode} icon={EyeOff} label="Privacy Mode" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-sm font-medium text-foreground hover:border-brand/40">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {activeProfile?.display_name?.charAt(0) || 'U'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => navigate('/profile')} className="gap-2"><User className="h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRegionOpen(true)} className="gap-2"><Globe className="h-4 w-4" /> Region &amp; Units</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/security')} className="gap-2"><ShieldCheck className="h-4 w-4" /> Security &amp; Privacy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/terms')} className="gap-2"><FileText className="h-4 w-4" /> Terms of Service</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/privacy')} className="gap-2"><Lock className="h-4 w-4" /> Privacy Policy</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/contact')} className="gap-2"><HelpCircle className="h-4 w-4" /> Contact &amp; Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={signOut} className="gap-2 text-destructive"><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <RegionUnitsModal open={regionOpen} onOpenChange={setRegionOpen} />
    </header>
  );
}