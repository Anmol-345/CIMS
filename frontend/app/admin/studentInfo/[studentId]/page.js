"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/utils/adminAuth";

export default function Page(props) {
  const [student, setStudent] = useState(null);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth(); 

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const { studentId } = await props.params;

        const res = await fetch(
          `http://localhost:5000/api/admin/students/${studentId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        setStudent(data);
        setUpdatedCourses(data.courses);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching student:", err);
      }
    };

    loadStudent();
  }, []);

  const updateMarks = (index, value) => {
    if (value < 0 || value > 100) return;

    const newCourses = [...updatedCourses];
    newCourses[index].marks = value;
    setUpdatedCourses(newCourses);
  };

  const saveAllChanges = async () => {
    try {
      const { studentId } = await props.params;

      const res = await fetch(
        `http://localhost:5000/api/admin/students/${studentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courses: updatedCourses }),
        }
      );

      const data = await res.json();
      console.log("Updated:", data);
      setEditing(false);
    } catch (err) {
      console.log("Failed to save updates:", err);
    }
  };

  if (loading || !student) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          
          {/* Student Basic Info */}
          <h2 className="text-2xl font-bold">
            {student.name} – {student.email}
          </h2>

          <p className="text-lg">
            Level:{" "}
            {student.level === "UnderGraduate"
              ? "Under Graduate"
              : student.level === "PostGraduate"
              ? "Post Graduate"
              : student.level}
          </p>

          {/* Title + Edit Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Courses & Marks</h3>

            {!editing ? (
              <Button variant="default" onClick={() => setEditing(true)}>
                Edit
              </Button>
            ) : (
              <Button variant="success" onClick={saveAllChanges}>
                Save
              </Button>
            )}
          </div>

          {/* Scrollable Course List */}
          <ScrollArea className="h-80 border p-3 rounded-md">
            {updatedCourses.map((c, index) => (
              <Card key={index} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    
                    <div>
                      <p>
                        <strong>Course:</strong> {c.course?.name}
                      </p>

                      <p className="mt-3">
                        <strong>Marks:</strong>{" "}
                        {editing ? (
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={c.marks}
                            onChange={(e) =>
                              updateMarks(index, Number(e.target.value))
                            }
                            className="w-24 mt-2"
                          />
                        ) : (
                          <span className="ml-1">{c.marks}</span>
                        )}
                      </p>
                    </div>

                    {c.feePaid ? (
                      <Badge className="bg-green-600">Paid</Badge>
                    ) : (
                      <Badge className="bg-red-600">Unpaid</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
