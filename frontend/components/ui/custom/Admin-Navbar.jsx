"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Approval", href: "/admin/approval" },
    { name: "Courses", href: "/admin/courses" },
    { name: "Notices", href: "/admin/notice" },
  ];

  return (
    <nav className="w-[80%] sm:w-[60%] mx-auto mt-4 rounded-2xl shadow-lg border bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between relative">
      
      {/* Brand */}
      <div className="font-semibold text-lg tracking-wide">CIMS Admin</div>

      {/* Desktop Links */}
      <div className="hidden sm:flex gap-6 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="transition hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Logout button desktop */}
      <div className="hidden sm:block">
        <button
          className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 transition duration-150"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div className="sm:hidden flex items-center gap-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[80%] bg-white dark:bg-zinc-900 shadow-md border-t border-zinc-200 dark:border-zinc-800 sm:hidden flex flex-col items-center py-4 gap-4 z-50 rounded-2xl">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition hover:text-zinc-600 dark:hover:text-zinc-300"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-150"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
