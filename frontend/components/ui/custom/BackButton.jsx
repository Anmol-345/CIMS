"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function TopLeftButton() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link href="/">
        <Button className="rounded-full w-12 h-12 p-0">
          <Home className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
