"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/utils/adminAuth";

export default function AdminPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");

  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/students", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const approved = data.filter((s) => s.accountStatus === "approved");
      setAllStudents(approved);
      setFilteredStudents(approved);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(text.toLowerCase()) ||
        s.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/students/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const updated = allStudents.filter((s) => s._id !== id);
        setAllStudents(updated);
        setFilteredStudents(updated);
      } else {
        console.error("Failed to delete student");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search student by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg dark:bg-neutral-900 dark:text-white"
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="truncate max-w-[150px]">{student.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{student.email}</TableCell>
                    <TableCell>
                      {student.level === "UnderGraduate"
                        ? "Under Graduate"
                        : student.level === "PostGraduate"
                        ? "Post Graduate"
                        : student.level}
                    </TableCell>
                    <TableCell className="text-right flex flex-col sm:flex-row gap-2 justify-end">
                      <Link href={`/admin/studentInfo/${student._id}`}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          View
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
