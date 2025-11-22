"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/utils/adminAuth";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const { admin, loading } = useAdminAuth();

  // Add course form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [level, setLevel] = useState("UnderGraduate");
  const [fee, setFee] = useState("");

  // Edit modal states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editFee, setEditFee] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const addCourse = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, level, fee }),
      });

      const data = await res.json();
      setCourses((prev) => [...prev, data]);

      // Reset form
      setName("");
      setCode("");
      setLevel("UnderGraduate");
      setFee("");
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courses/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setEditName(course.name);
    setEditCode(course.code);
    setEditLevel(course.level);
    setEditFee(course.fee);
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/update/${editingCourse._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            code: editCode,
            level: editLevel,
            fee: editFee,
          }),
        }
      );

      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditingCourse(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="w-full flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-[#111] border rounded-xl p-4 shadow-md">

        {/* Add Course Form */}
        <h2 className="text-xl font-bold mb-3 text-center sm:text-left">Add New Course</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Course Name"
            className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Code"
            className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="UnderGraduate">Under Graduate</option>
            <option value="PostGraduate">Post Graduate</option>
          </select>
          <input
            type="number"
            placeholder="Course Fee"
            className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        <Button onClick={addCourse} className="mb-6 w-full sm:w-auto">Add Course</Button>

        {/* Courses Table */}
        <div className="overflow-x-auto max-h-[60vh]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.level === "UnderGraduate" ? "Under Graduate" : "Post Graduate"}</TableCell>
                  <TableCell>₹{course.fee}</TableCell>
                  <TableCell className="text-right flex flex-col sm:flex-row gap-2 justify-end">

                    {/* Edit Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-full w-full sm:w-auto"
                          onClick={() => openEditModal(course)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>

                      {editingCourse && editingCourse._id === course._id && (
                        <DialogContent className="w-full max-w-sm sm:max-w-md mx-4 sm:mx-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                            <DialogDescription>Modify course details</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-3 mt-3">
                            <input
                              type="text"
                              className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                            <input
                              type="text"
                              className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                            />
                            <select
                              className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
                              value={editLevel}
                              onChange={(e) => setEditLevel(e.target.value)}
                            >
                              <option value="UnderGraduate">Under Graduate</option>
                              <option value="PostGraduate">Post Graduate</option>
                            </select>
                            <input
                              type="number"
                              className="p-2 border rounded-lg dark:bg-neutral-900 dark:text-white w-full"
                              value={editFee}
                              onChange={(e) => setEditFee(e.target.value)}
                            />
                            <Button onClick={saveEdit} className="w-full">Save</Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    {/* Delete */}
                    <Button
                      className="rounded-full bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                      onClick={() => deleteCourse(course._id)}
                    >
                      Delete
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
