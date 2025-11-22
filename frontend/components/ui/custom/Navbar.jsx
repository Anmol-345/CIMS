"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/students/logout", {
        method: "GET",
        credentials: "include",
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full flex items-center justify-center py-4 px-4 relative">

      {/* Center nav links */}
      <div className="px-6 py-2 rounded-full border bg-background shadow-sm flex gap-6 text-sm font-medium">
        <Link href="/student-portal" className="hover:text-primary">
          Profile
        </Link>
        <Link href="/student-portal/courses" className="hover:text-primary">
          Courses
        </Link>
        <Link href="/student-portal/fees" className="hover:text-primary">
          Fees
        </Link>
      </div>

      {/* Logout Icon Button */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="absolute right-4 rounded-full p-2 border transition-colors
                   hover:bg-red-600 hover:text-white"
      >
        <LogOut className="h-5 w-5" />
      </Button>

    </nav>
  );
}
