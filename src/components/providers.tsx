"use client";

import { UserProvider } from "@/hooks/use-user";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}

