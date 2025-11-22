// utils/auth.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// fetch user from backend (does NOT use hooks)
export async function fetchUser() {
  try {
    const res = await fetch("http://localhost:5000/api/students/me", {
      method: "GET",
      credentials: "include", // sends HttpOnly cookie
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}

// React hook for auth + redirect
export function useAuth(redirectPending = true) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validate() {
      const u = await fetchUser();

      if (!u) {
        router.push("/login");
        return;
      }

      if (redirectPending && u.accountStatus === "pending") {
        router.push("/pending");
      }

      setUser(u);
      setLoading(false);
    }

    validate();
  }, [router, redirectPending]);

  return { user, loading };
}
