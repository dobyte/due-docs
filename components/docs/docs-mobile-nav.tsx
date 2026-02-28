"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DocsNavContent } from "@/components/docs/docs-sidebar";

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="size-7" onClick={() => setOpen(true)}>
        <PanelLeftIcon />
        <span className="sr-only">Toggle navigation</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="overflow-auto p-4">
            <DocsNavContent pathname={pathname} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
