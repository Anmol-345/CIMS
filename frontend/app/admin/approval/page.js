"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function PendingApprovals() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/students", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const pending = data.filter((s) => s.accountStatus === "pending");
      setPendingStudents(pending);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/students/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      setPendingStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/students/${id}/reject`, {
        method: "DELETE",
        credentials: "include",
      });
      setPendingStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  return (
    <div className="w-full flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl overflow-x-auto border rounded-xl p-4 shadow-md bg-white dark:bg-[#111]">
        {/* If NO pending students */}
        {pendingStudents.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
            No student approval requests received.
          </div>
        ) : (
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pendingStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.level === "UnderGraduate"
                      ? "Under Graduate"
                      : student.level === "PostGraduate"
                      ? "Post Graduate"
                      : student.level}
                  </TableCell>

                  <TableCell className="text-right flex flex-wrap gap-2 justify-end">
                    {/* View Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-full"
                        >
                          View
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md max-w-full">
                        <DialogHeader>
                          <DialogTitle>{student.name}'s Courses</DialogTitle>
                        </DialogHeader>

                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                          {student.courses.map((c, i) => (
                            <div
                              key={i}
                              className="border p-3 rounded-lg mb-2 bg-neutral-100 dark:bg-neutral-900"
                            >
                              <p>
                                <strong>Course:</strong> {c?.course?.name}
                              </p>
                              <p>
                                <strong>Code:</strong> {c?.course?.code}
                              </p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Approve Button */}
                    <Button
                      className="rounded-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(student._id)}
                    >
                      Approve
                    </Button>

                    {/* Reject Button */}
                    <Button
                      className="rounded-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleReject(student._id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
