"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminAuth } from "@/utils/adminAuth";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { admin } = useAdminAuth();

  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/notices", { credentials: "include" });
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.notices ?? [];
      setNotices(items);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await fetch("http://localhost:5000/api/notices/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      setTitle("");
      setDescription("");
      await fetchNotices();
    } catch (err) {
      console.error("Add notice failed:", err);
    }
  };

  const openEdit = (notice) => {
    setEditing(notice);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
    setEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e?.preventDefault();
    if (!editing) return;
    try {
      await fetch(`http://localhost:5000/api/notices/update/${editing._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), description: editDescription.trim() }),
      });
      setEditOpen(false);
      setEditing(null);
      await fetchNotices();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await fetch(`http://localhost:5000/api/notices/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchNotices();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-4xl flex flex-col gap-4">

        {/* Add Notice Form */}
        <Card className="shadow">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">Manage Notices</h1>
                <p className="text-sm text-muted-foreground">
                  Create, edit and remove campus notices.
                </p>
              </div>
              <Button onClick={fetchNotices} variant="ghost" size="sm">
                Refresh
              </Button>
            </div>

            <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2 items-end">
              <div className="flex flex-col">
                <label className="text-sm mb-2">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-2">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
              </div>
              <div className="flex gap-2 sm:col-span-2 justify-end">
                <Button type="submit">Add Notice</Button>
                <Button variant="outline" onClick={() => { setTitle(""); setDescription(""); }}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notices Table */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-medium">All Notices</h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 w-full overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            No notices found.
                          </TableCell>
                        </TableRow>
                      )}
                      {notices.map((n) => (
                        <TableRow key={n._id}>
                          <TableCell className="max-w-[200px] truncate">{n.title}</TableCell>
                          <TableCell className="max-w-[400px] truncate">{n.description}</TableCell>
                          <TableCell>{n.createdAt ? format(new Date(n.createdAt), "dd MMM yyyy") : "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">

                              {/* Edit Modal */}
                              <Dialog
                                open={editOpen && editing?._id === n._id}
                                onOpenChange={(open) => {
                                  if (!open) { setEditOpen(false); setEditing(null); }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => openEdit(n)}>
                                    Edit
                                  </Button>
                                </DialogTrigger>

                                {editing && editing._id === n._id && (
                                  <DialogContent className="w-full max-w-sm sm:max-w-md mx-4 sm:mx-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit Notice</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdate} className="grid gap-3">
                                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                      <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                      <DialogFooter className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => { setEditOpen(false); setEditing(null); }}>
                                          Cancel
                                        </Button>
                                        <Button type="submit">Save</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                )}
                              </Dialog>

                              <Button variant="destructive" size="sm" onClick={() => handleDelete(n._id)}>
                                Delete
                              </Button>

                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
