"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/utils/auth";

export default function CoursesPage() {
  const { user, loading } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [mergedCourses, setMergedCourses] = useState([]);

  // Fetch all courses from backend
  const fetchAllCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setAllCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Merge student courses with course info
  const mergeCourses = () => {
    if (!user || allCourses.length === 0) return;

    const merged = user.courses.map((uc) => {
      const courseInfo = allCourses.find(
        (ac) => ac._id === uc.course
      );

      return {
        _id: uc.course.toString(),
        name: courseInfo ? courseInfo.name : "Unknown Course",
        code: courseInfo ? courseInfo.code : "N/A",
        level: courseInfo ? courseInfo.level : "N/A",
        marks: uc.marks !== null && uc.marks !== undefined ? uc.marks : "Yet to be assessed",
      };
    });

    setMergedCourses(merged);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    mergeCourses();
  }, [user, allCourses]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!user) return <p className="text-center mt-8">Please login to see your courses.</p>;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">My Courses</h1>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Marks Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mergedCourses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="truncate max-w-[150px] sm:max-w-full">{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>
                    {course.level === "UnderGraduate"
                        ? "Under Graduate"
                        : course.level === "PostGraduate"
                        ? "Post Graduate"
                        : course.level}
                  </TableCell>
                  <TableCell>{course.marks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
