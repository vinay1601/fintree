"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PagesTable() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editPage, setEditPage] = useState(null);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(sessionStorage.getItem("accessToken"));
    }
  }, []);

  // Fetch all pages from API
  const fetchPages = async () => {
    try {
     if (!token) return;

      const res = await fetch(`${baseURL}/pages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          sessionStorage.clear();
          localStorage.clear();
          router.push("/login");
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return;
      }

      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

    useEffect(() => {
    fetchPages();
  }, [token]);

  // Filter pages
  const filteredPages = pages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.url.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPages.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPages.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Handle Save (Add or Update)
  const handleSavePage = async () => {
    if (!formData.name || !formData.url) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!token) {
      toast.error("Not authenticated. Please login again.");
      router.push("/login");
      return;
    }

    try {
      if (editPage) {
        setPages((prev) =>
          prev.map((p) => (p.id === editPage.id ? { ...p, ...formData } : p))
        );
        toast.success("Page updated locally!");
      } else {
        const res = await fetch(`${baseURL}/pages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            sessionStorage.clear();
            localStorage.clear();
            router.push("/login");
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return;
        }

        const newPage = await res.json();
        setPages((prev) => [...prev, newPage]);
        toast.success("Page added successfully!");
      }

      setFormData({ name: "", url: "" });
      setEditPage(null);
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Handle Delete (local only)
  const handleDeletePage = () => {
    setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
    setDeleteOpen(false);
    toast.success("Page deleted successfully!");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          className="max-w-sm"
        />

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setEditPage(null);
                setFormData({ name: "", url: "" });
              }}
            >
              <Plus className="w-4 h-4" /> Add Page
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editPage ? "Edit Page" : "Add Page"}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 mb-3">
              <div>
                <label className="block mb-1 font-medium">Page Name</label>
                <Input
                  placeholder="Page Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Page URL</label>
                <Input
                  placeholder="/example"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePage}>
                {editPage ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full rounded-md">
        <Table className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRecords.map((page, index) => (
              <TableRow
                key={page.id}
                className={`hover:bg-gray-50 px-3 dark:hover:bg-gray-800 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <TableCell>{page.id}</TableCell>
                <TableCell>{page.name}</TableCell>
                <TableCell>{page.url}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditPage(page);
                      setFormData({ name: page.name, url: page.url });
                      setFormOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setPageToDelete(page);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete page{" "}
            <strong>{pageToDelete?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}




//********************************working code 3-10-25**************************************** */

// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash, Plus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// // Dummy initial pages
// const initialPages = [
//   { id: 1, name: "Dashboard", url: "/dashboard" },
//   { id: 2, name: "Users", url: "/users" },
// ];

// export default function PagesTable() {
//   const [pages, setPages] = useState(initialPages);
//   const [search, setSearch] = useState("");

//   // Add/Edit form states
//   const [formOpen, setFormOpen] = useState(false);
//   const [editPage, setEditPage] = useState(null);
//   const [formData, setFormData] = useState({ name: "", url: "" });

//   // Delete states
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [pageToDelete, setPageToDelete] = useState(null);

//   // Filter pages
//   const filteredPages = pages.filter(
//     (p) =>
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.url.toLowerCase().includes(search.toLowerCase())
//   );

//   // Handle Save (Add or Update)
//   const handleSavePage = () => {
//     if (!formData.name || !formData.url) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (editPage) {
//       // Update existing
//       setPages((prev) =>
//         prev.map((p) => (p.id === editPage.id ? { ...p, ...formData } : p))
//       );
//       toast.success("Page updated successfully!");
//     } else {
//       // Add new
//       const newPage = {
//         id: pages.length + 1,
//         ...formData,
//       };
//       setPages((prev) => [...prev, newPage]);
//       toast.success("Page added successfully!");
//     }

//     setFormData({ name: "", url: "" });
//     setEditPage(null);
//     setFormOpen(false);
//   };

//   // Handle Delete
//   const handleDeletePage = () => {
//     setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
//     setDeleteOpen(false);
//     toast.success("Page deleted successfully!");
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center gap-4">
//         <Input
//           placeholder="Search pages..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />

//         <Dialog open={formOpen} onOpenChange={setFormOpen}>
//           <DialogTrigger asChild>
//             <Button
//               className="flex items-center gap-2"
//               onClick={() => {
//                 setEditPage(null);
//                 setFormData({ name: "", url: "" });
//               }}
//             >
//               <Plus className="w-4 h-4" /> Add Page
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{editPage ? "Edit Page" : "Add Page"}</DialogTitle>
//             </DialogHeader>

//             <div className="flex flex-col gap-3 mb-3">
//               <div>
//                 <label className="block mb-1 font-medium">Page Name</label>
//                 <Input
//                   placeholder="Page Name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Page URL</label>
//                 <Input
//                   placeholder="/example"
//                   value={formData.url}
//                   onChange={(e) =>
//                     setFormData({ ...formData, url: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setFormOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSavePage}>
//                 {editPage ? "Update" : "Add"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full rounded-md">
//         <Table className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>URL</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredPages.map((page, index) => (
//               <TableRow
//                 key={page.id}
//                 className={`hover:bg-gray-50 px-3 dark:hover:bg-gray-800 ${
//                   index % 2 === 0
//                     ? "bg-white dark:bg-gray-900"
//                     : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 <TableCell>{page.id}</TableCell>
//                 <TableCell>{page.name}</TableCell>
//                 <TableCell>{page.url}</TableCell>
//                 <TableCell className="flex gap-2">
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     onClick={() => {
//                       setEditPage(page);
//                       setFormData({ name: page.name, url: page.url });
//                       setFormOpen(true);
//                     }}
//                   >
//                     <Edit className="w-4 h-4 text-blue-600" />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     onClick={() => {
//                       setPageToDelete(page);
//                       setDeleteOpen(true);
//                     }}
//                   >
//                     <Trash className="w-4 h-4 text-red-600" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Delete Confirmation */}
//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>
//           <p>
//             Are you sure you want to delete page{" "}
//             <strong>{pageToDelete?.name}</strong>?
//           </p>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeletePage}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
