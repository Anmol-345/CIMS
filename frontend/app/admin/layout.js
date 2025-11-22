"use client";

import AdminNavbar from "@/components/ui/custom/Admin-Navbar";
import { usePathname } from "next/navigation";


export default function AdminLayout({ children }) {

   const pathname = usePathname();
  return (
      <div className="min-h-screen flex flex-col">
        {pathname !== "/admin/login" && <AdminNavbar />}

        <div className="flex-1 p-6 bg-background">
          {children}
        </div>
      </div>

  );
}