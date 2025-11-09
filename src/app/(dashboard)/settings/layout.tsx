'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Settings,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Users,
  Palette,
  Download,
  Lock,
  Globe,
} from 'lucide-react';

const settingsMenu = [
  {
    href: '/settings/general',
    label: 'General',
    icon: Settings,
    description: 'Restaurant information and basic settings',
  },
  {
    href: '/settings/company-profile',
    label: 'Company Profile',
    icon: Building2,
    description: 'Company details and registration',
  },
  {
    href: '/settings/payment',
    label: 'Payment Settings',
    icon: CreditCard,
    description: 'Payment methods and gateway configuration',
  },
  {
    href: '/settings/notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email, SMS, and push notification preferences',
  },
  {
    href: '/settings/security',
    label: 'Security',
    icon: Shield,
    description: 'Password policies, 2FA, and session management',
  },
  {
    href: '/settings/staff',
    label: 'Staff & Roles',
    icon: Users,
    description: 'Manage staff permissions and roles',
  },
  {
    href: '/settings/appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Theme, logo, and UI customization',
  },
  {
    href: '/settings/integrations',
    label: 'Integrations',
    icon: Globe,
    description: 'Third-party service integrations',
  },
  {
    href: '/settings/backup',
    label: 'Backup & Export',
    icon: Download,
    description: 'Data backup and export settings',
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your restaurant settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar - Fixed */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-[73px] lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
            <nav className="space-y-1">
              {settingsMenu.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-start gap-3 rounded-lg p-3 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content - Scrollable */}
        <div className="lg:col-span-3">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

