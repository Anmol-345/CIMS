"use client";

import { useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import BackButton from "@/components/ui/custom/BackButton";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    level: "UnderGraduate",
    courses: [],
  });

  const [allCourses, setAllCourses] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch ALL courses once
  const fetchAllCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setAllCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // filter courses by level
  const filteredCourses = allCourses.filter((c) => c.level === form.level);

  const handleCourseSelection = (courseId) => {
    setForm((prev) => {
      const exists = prev.courses.includes(courseId);
      return {
        ...prev,
        courses: exists
          ? prev.courses.filter((id) => id !== courseId)
          : [...prev.courses, courseId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setAlertMsg(data.message || "Something went wrong");
        return;
      }

      if (data.message === "Registered successfully") {
        window.location.href = "/login";
        return;
      }
    } catch (error) {
      setLoading(false);
      setAlertMsg("Server error. Please try again.");
    }
  };

  return (
    <>
    <BackButton/>
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6">
      <div className="w-full max-w-lg p-6 sm:p-8 border rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Create Account
        </h2>

        {alertMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="mb-2">Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* LEVEL SELECT */}
          <div>
            <Label className="mb-2">Level</Label>
            <Select
              value={form.level}
              onValueChange={(val) =>
                setForm({ ...form, level: val, courses: [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UnderGraduate">UnderGraduate</SelectItem>
                <SelectItem value="PostGraduate">PostGraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* COURSE CHECKBOXES */}
          <div>
            <Label className="mb-2">Courses</Label>
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No courses available
                </p>
              ) : (
                filteredCourses.map((course) => (
                  <label
                    key={course._id}
                    className="flex items-center gap-2 py-1 text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      checked={form.courses.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                    />
                    <span>
                      {course.name} — ₹{course.fee}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
