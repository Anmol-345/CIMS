"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    async function loadNotices() {
      try {
        const res = await fetch("http://localhost:5000/api/notices/");
        const data = await res.json();

        // Sort by date (latest first) and show only 3
        const lastThree =
          (data.notices || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        setNotices(lastThree);
      } catch (err) {
        console.error("Error loading notices:", err);
        setNotices([]);
      }
    }

    loadNotices();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* NAVBAR */}
      <header className="w-full border-b bg-white dark:bg-[#111] shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold text-blue-600 text-center sm:text-left">
            ABC Engineering College
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-center"
            >
              Student Portal
            </Link>

            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition text-center"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center flex-grow px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-6">
          Campus Information Management System
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl">
          Seamless management of students, courses, admin functions, and notices—all in one place.
        </p>
      </section>

      {/* NOTICES */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Latest Notices</h2>

        {notices.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No notices available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <Card key={notice._id} className="shadow-md hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{notice.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {notice.description}
                  </p>

                  {notice.createdAt && (
                    <p className="text-xs text-gray-500 text-right">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
