"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Fetch admin user using backend cookie
export async function fetchAdmin() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/me", {
      method: "GET",
      credentials: "include", // sends HttpOnly token cookie
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("Error fetching admin:", err);
    return null;
  }
}

// React hook for admin auth
export function useAdminAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validate() {
      const a = await fetchAdmin();

      if (!a) {
        router.push("/admin/login");
        return;
      }

      setAdmin(a);
      setLoading(false);
    }

    validate();
  }, [router]);

  return { admin, loading };
}
