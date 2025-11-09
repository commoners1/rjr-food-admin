
"use client";

export const dynamic = 'force-dynamic';

import { Suspense, type ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
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
          <div className="text-xs text-muted-foreground text-center py-2 px-2 border-t">
            <p className="mb-1">© {new Date().getFullYear()} Rumah Jajan Rara</p>
            <p className="text-[10px] opacity-70">All rights reserved</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hidden md:flex" />
            <MobileNav />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <UserNav />
          </div>
        </header>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/95">
            <Suspense fallback={
              <div className="space-y-4 sm:space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Rumah Jajan Rara. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
