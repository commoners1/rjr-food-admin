'use client';

import { useState } from 'react';
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
  Building2,
  ChevronDown,
  ChevronRight,
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
  href?: string; // Optional href for parent link
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
    href: '/settings/general',
    label: 'settings',
    icon: Settings,
    roles: ['admin'],
  },
];

interface NavLinksProps {
  onLinkClick?: () => void;
}

export function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(() => {
    // Auto-expand if any child is active
    const expanded = new Set<string>();
    parentLinks.forEach((link) => {
      if ('subLinks' in link) {
        const hasActiveChild = link.subLinks.some((subLink) => pathname === subLink.href);
        if (hasActiveChild) {
          expanded.add(link.label);
        }
      }
    });
    return expanded;
  });

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const renderLink = (link: NavLink, isSubMenu = false) => {
    // Special handling for Settings - active if pathname starts with /settings
    const isActive = link.href === '/settings/general' 
      ? pathname.startsWith('/settings')
      : pathname === link.href;
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
    const isExpanded = expandedMenus.has(link.label);
    const isActive = link.href ? pathname === link.href : hasActiveChild;

    return (
      <div key={link.label} className="space-y-1">
        {link.href ? (
          <Link
            href={link.href}
            onClick={(e) => {
              // If clicking the chevron, toggle menu instead of navigating
              if ((e.target as HTMLElement).closest('.chevron-button')) {
                e.preventDefault();
                toggleMenu(link.label);
              } else {
                onLinkClick?.();
              }
            }}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="capitalize flex-1">{link.label}</span>
            <button
              className="chevron-button p-0.5 hover:bg-accent rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(link.label);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </Link>
        ) : (
          <button
            onClick={() => toggleMenu(link.label)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full',
              hasActiveChild
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="capitalize flex-1 text-left">{link.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
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
