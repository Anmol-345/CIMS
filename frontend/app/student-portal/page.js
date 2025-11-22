"use client";

import { useAuth } from "@/utils/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function StudentPortalPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex justify-center items-start mt-10 px-4 min-h-[70vh]">
      <Card className="w-full max-w-md border rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-3 pt-6">

          {/* Avatar */}
          <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Name */}
          <CardTitle className="text-center">
            {user.name}
          </CardTitle>

          {/* Email */}
          <CardDescription className="text-center">
            {user.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-2 text-sm pb-6">

          {/* Level */}
          <p className="text-muted-foreground">
            {user.level === "UnderGraduate"
              ? "Under Graduate"
              : user.level === "PostGraduate"
              ? "Post Graduate"
              : user.level}
          </p>

          {/* Created Date */}
          <p className="text-muted-foreground">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
