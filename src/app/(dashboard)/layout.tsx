
"use client";

export const dynamic = 'force-dynamic';

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useUser } from "@/hooks/use-user";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Give a small delay to allow user state to be set after login
    const timer = setTimeout(() => {
      if (!isLoading && !user) {
        // Check localStorage as fallback
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('currentUserId');
          if (!storedUserId) {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <NavLinks />
        </SidebarContent>
        <SidebarFooter>
          {/* <UserNav /> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
           <div className="flex items-center gap-2">
            <SidebarTrigger className="hidden md:flex" />
            <MobileNav />
          </div>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
           <div className="ml-4">
            <LanguageSwitcher />
          </div>
          <div className="ml-2">
            <ThemeSwitcher />
          </div>
          <div className="ml-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/95">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
