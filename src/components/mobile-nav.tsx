
"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavLinks } from "./nav-links";
import { Logo } from "./logo";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[300px]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <NavLinks onLinkClick={() => setOpen(false)} />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
