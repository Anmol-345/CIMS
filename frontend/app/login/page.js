"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/custom/BackButton";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.message === "Invalid credentials") {
        setError("Invalid credentials");
        return;
      }

      if (res.ok) {
        router.push("/student-portal");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.log(err);
    }
  };

  return (
    <>
      <BackButton />
      <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 sm:px-6">
        <Card className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-2xl">Login</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Invalid Credentials</AlertTitle>
                <AlertDescription>Please recheck your credentials</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" className="w-full" disabled={!email || !password}>
                Login
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <Link href="/register" className="underline">
                Create new account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
