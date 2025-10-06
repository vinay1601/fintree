"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DataTable = ({ apiUrl, schema, initialForm, columns }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit Form (Create / Update)
  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm(initialForm);
      setEditingId(null);
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setOpen(true);
  };

  return (
    <div className="p-4">
      {/* Add Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Record" : "Add Record"}</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-3">
            {Object.keys(initialForm).map((key) => (
              <Input
                key={key}
                name={key}
                placeholder={key}
                value={form[key] || ""}
                onChange={handleChange}
              />
            ))}
            <Button type="button" onClick={handleSubmit}>
              {editingId ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </TableCell>
              ))}
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
