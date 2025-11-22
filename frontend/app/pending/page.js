"use client";

import { useAuth } from "@/utils/auth";
import { Card, CardContent } from "@/components/ui/card";
import { ClockAlert } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/ui/custom/BackButton";

export default function PendingPage() {
  const { user, loading } = useAuth(false);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        No user data available
      </div>
    );

  // Format level for better display
  const formattedLevel = user.level
    ?.replace(/([a-z])([A-Z])/g, "$1 $2")
    ?.trim();

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6">
        <Card className="w-full max-w-md sm:max-w-lg border rounded-2xl shadow-md p-6 sm:p-8 bg-white dark:bg-gray-900">
          <CardContent className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-700/30 text-yellow-600 dark:text-yellow-400 shadow">
                <ClockAlert size={46} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-center text-foreground">
              Account Pending Approval
            </h1>

            {/* User Details */}
            <div className="space-y-2 sm:space-y-3 text-foreground text-sm sm:text-base">
              <div>
                <span className="font-medium">Name:</span> {user.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Level:</span> {formattedLevel}
              </div>
            </div>

            {/* Message */}
            <p className="text-center text-muted-foreground text-sm sm:text-base leading-relaxed">
              Your account is awaiting administrator approval. You will be
              notified once your account is activated.
            </p>
            <p className="text-center text-sm sm:text-base">
              <Link
                href="/student-portal"
                className="text-blue-600 hover:underline"
              >
                Retry
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
