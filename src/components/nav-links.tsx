'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Utensils,
  Image as ImageIcon,
  Monitor,
  MessageSquare,
  UserCheck,
  DollarSign,
  Settings,
  Package,
  Tag,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  division?: string[];
  isSubMenu?: boolean;
}

interface ParentNavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  division?: string[];
  subLinks: NavLink[];
}

const parentLinks: (NavLink | ParentNavLink)[] = [
  {
    href: '/',
    label: 'dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    href: '/orders',
    label: 'orders',
    icon: Package,
    roles: ['admin', 'manager'],
  },
  {
    href: '/menu',
    label: 'menu',
    icon: Utensils,
    roles: ['admin', 'manager'],
  },
  {
    href: '/banner',
    label: 'banner',
    icon: ImageIcon,
    roles: ['admin', 'manager'],
  },
  {
    href: '/media',
    label: 'media',
    icon: ImageIcon,
    roles: ['admin', 'manager'],
  },
  {
    href: '/kds',
    label: 'kds',
    icon: Monitor,
    roles: ['admin', 'manager', 'kitchen'],
  },
  {
    href: '/reviews',
    label: 'reviews',
    icon: MessageSquare,
    roles: ['admin', 'manager'],
  },
  {
    href: '/promotions',
    label: 'promotions',
    icon: Tag,
    roles: ['admin', 'manager'],
  },
  {
    href: '/customers',
    label: 'customers',
    icon: Users,
    roles: ['admin', 'manager'],
  },
  {
    href: '/attendance',
    label: 'attendance',
    icon: UserCheck,
    roles: ['admin', 'manager', 'hr'],
  },
  {
    href: '/finance',
    label: 'finance',
    icon: DollarSign,
    roles: ['admin', 'finance'],
  },
  {
    href: '/analytics',
    label: 'analytics',
    icon: BarChart3,
    roles: ['admin', 'manager'],
  },
  {
    label: 'settings',
    icon: Settings,
    roles: ['admin'],
    subLinks: [
      {
        href: '/settings/general',
        label: 'general',
        icon: Settings,
        roles: ['admin'],
        isSubMenu: true,
      },
    ],
  },
];

interface NavLinksProps {
  onLinkClick?: () => void;
}

export function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  const renderLink = (link: NavLink, isSubMenu = false) => {
    const isActive = pathname === link.href;
    const Icon = link.icon;

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onLinkClick}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          isSubMenu && 'ml-6'
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="capitalize">{link.label}</span>
      </Link>
    );
  };

  const renderParentLink = (link: ParentNavLink) => {
    const Icon = link.icon;
    const hasActiveChild = link.subLinks.some((subLink) => pathname === subLink.href);
    const isExpanded = hasActiveChild;

    return (
      <div key={link.label} className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            hasActiveChild
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="capitalize flex-1">{link.label}</span>
        </div>
        {isExpanded && (
          <div className="ml-4 space-y-1 border-l pl-2">
            {link.subLinks.map((subLink) => renderLink(subLink, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {parentLinks.map((link) => {
        if ('subLinks' in link) {
          return renderParentLink(link);
        }
        return renderLink(link);
      })}
    </nav>
  );
}
