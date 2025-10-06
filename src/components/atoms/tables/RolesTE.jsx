"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Minus, Edit, Trash, Key } from "lucide-react";
import AlertDialog from "@/components/molecules/alerts/AlertDialog";
import { z } from "zod";

// Validation schema
const roleSchema = z.object({
  name: z.string().min(1, "Role Name is required"),
  description: z.string().optional(),
});


export default function RoleTable() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);

  // Add/Edit role dialog
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({ name: "", company: "", description: "" });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    description: "",
    type: "success",
  });

  const router = useRouter();
  const itemsPerPage = 10;

  // Show alert helper
  const showAlert = (title, description, type = "success") => {
    setAlertData({ title, description, type });
    setAlertOpen(true);
  };

  //  if (response.status === 401) {
  //         sessionStorage.clear();
  //          router.push(`/login`);
  //         showAlert("Error", "Session expired, please log in again", "error");
  //         sessionStorage.removeItem("accessToken");
  //         return;
  //   }

  // Fetch roles
  useEffect(() => {
    fetchRoles();
  }, []);

      const fetchRoles = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          showAlert("Error", "No token found, please log in again", "error");
          return;
        }

        const response = await fetch(`${baseURL}/roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          sessionStorage.clear();
           router.push(`/login`);
          showAlert("Error", "Session expired, please log in again", "error");
          sessionStorage.removeItem("accessToken");
          return;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch roles: ${response.status} - ${text}`);
        }

        const data = await response.json();
        console.log("add data",data)
        setRoles(data);
      } catch (error) {
        console.error(error);
        showAlert("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

  // Filter roles
  const filteredData = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.company.toLowerCase().includes(search.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Add / Update Role
const handleUpdateRole = async () => {
  try {
    if (!editingRole) return;
    setFormErrors({});
    roleSchema.parse(newRole);

    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      showAlert("Error", "Token not found in session", "error");
      return;
    }

    const response = await fetch(
      `${baseURL}/roles/${editingRole.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRole.name,
          description: newRole.description,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to update role");

    showAlert("Success", `${newRole.name} updated successfully!`);
    fetchRoles(); // refresh table
    setNewRole({ name: "", description: "" });
    setEditingRole(null);
    setOpen(false);
  } catch (error) {
    if (error instanceof z.ZodError) {
      setFormErrors(error.flatten().fieldErrors);
    } else {
      showAlert("Error", error.message || "Something went wrong", "error");
      console.error(error);
    }
  }
};


const handleAddRole = async () => {
  console.log("add")
  try {
    setFormErrors({});
    roleSchema.parse(newRole);
 console.log("add2")
    const companyId = Number(sessionStorage.getItem("companyId")); // get company_id from session
    const token = sessionStorage.getItem("accessToken");

    if (!companyId || !token) {
      showAlert("Error", "Company ID or Token not found in session", "error");
      return;
    }

    const response = await fetch(`${baseURL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_id: companyId, // note: use company_id
        name: newRole.name,
        description: newRole.description,
      }),
    });

    if (!response.ok) throw new Error("Failed to create role");

    showAlert("Success", `${newRole.name} added successfully!`);
    fetchRoles(); // refresh table
    setNewRole({ name: "", description: "" });
    setOpen(false);
  } catch (error) {
    if (error instanceof z.ZodError) {
      setFormErrors(error.flatten().fieldErrors);
    } else {
      showAlert("Error", error.message || "Something went wrong", "error");
      console.error(error);
    }
  }
};




  // Delete Role
  const handleDeleteRole = async () => {
  try {
    if (!roleToDelete) return;

    // Get token from sessionStorage
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      showAlert("Error", "Not authenticated", "error");
      return;
    }

    // Call DELETE API
    const res = await fetch(`${baseURL}/roles/${roleToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Add the token here
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete role");
    }

    // Update local state
    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    setDeleteDialogOpen(false);
    showAlert("Deleted", `${roleToDelete.name} has been deleted!`, "success");
  } catch (error) {
    console.error(error);
    showAlert("Error", error.message || "Something went wrong", "error");
  }
};


  if (loading) {
    return <p className="text-center p-4">Loading roles...</p>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button
      className="flex items-center gap-2"
      onClick={() => {
        setEditingRole(null);
        setNewRole({ name: "", description: "" }); // company_id is taken from session automatically
      }}
    >
      <Plus className="w-4 h-4" /> Add Role
    </Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
    </DialogHeader>

    <div className="flex flex-col gap-3 mb-3">
      <div>
        <label className="block mb-1 font-medium">Role Name</label>
        <Input
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        />
        {formErrors.name && (
          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Input
          placeholder="Description"
          value={newRole.description}
          onChange={(e) =>
            setNewRole({ ...newRole, description: e.target.value })
          }
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {editingRole ? (
        <Button onClick={handleUpdateRole}>Update</Button>
      ) : (
        <Button onClick={handleAddRole}>Add</Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>

      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full rounded-md">
        <Table className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-center align-middle">
       <TableHeader className="bg-gray-50 dark:bg-gray-800">
  <TableRow className="text-center">
    <TableHead className="md:hidden"></TableHead>
    <TableHead className="text-center">ID</TableHead>
    <TableHead className="text-center">Role Name</TableHead>
    <TableHead className="hidden md:table-cell text-center">Description</TableHead>
    <TableHead className="hidden md:table-cell text-center">Date Added</TableHead>
    <TableHead className="hidden md:table-cell text-center">Action</TableHead>
  </TableRow>
</TableHeader>


<TableBody>
  {paginatedData.map((role, index) => {
    const isExpanded = expandedRows.includes(role.id);

    // Format created_at date
    const formattedDate = new Date(role.created_at).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return (
      <React.Fragment key={role.id}>
        <TableRow
          className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
            index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
          }`}
        >
          <TableCell className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleExpandRow(role.id)}
            >
              {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </TableCell>

          <TableCell>{role.id}</TableCell>
          <TableCell>{role.name}</TableCell>
          <TableCell className="hidden md:table-cell">{role.description || "-"}</TableCell>
          <TableCell className="hidden md:table-cell">{formattedDate}</TableCell>

          <TableCell className="hidden md:table-cell gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditingRole(role);
                setNewRole({
                  name: role.name,
                  company: role.company,
                  description: role.description,
                });
                setOpen(true);
              }}
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setRoleToDelete(role);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          </TableCell>
        </TableRow>

        {isExpanded && (
          <TableRow className="bg-gray-100 dark:bg-gray-800 md:hidden">
            <TableCell colSpan={5} className="p-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div><strong>Description:</strong> {role.description || "-"}</div>
                <div><strong>Date Added:</strong> {formattedDate}</div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingRole(role);
                      setNewRole({
                        name: role.name,
                        company: role.company,
                        description: role.description,
                      });
                      setOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setRoleToDelete(role);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  })}
</TableBody>

        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete role <strong>{roleToDelete?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert */}
      <AlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertData.title}
        description={alertData.description}
        type={alertData.type}
        autoClose={2000}
      />
    </div>
  );
}


//******************************working code 4-10-25*************************************8 */
// "use client";
// import React from "react";
// import { useState,useEffect, useMemo } from "react";
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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus, Minus, Edit, Trash, Key } from "lucide-react";
// import AlertDialog from "@/components/molecules/alerts/AlertDialog";
// import { z } from "zod";
// import { useRouter } from "next/navigation";

// // Validation schema
// const roleSchema = z.object({
//   name: z.string().min(1, "Role Name is required"),
//   company: z.string().min(1, "Company is required"),
//   description: z.string().optional(),
// });

// // Initial data
// const initialRoles = [
//   {
//     id: 1,
//     name: "manager",
//     company: "Google",
//     description: "specific grant access to this role",
//     date: "2025-09-23",
//     createdBy: "Admin",
//     updated: true,
//   },
//   {
//     id: 2,
//     name: "admin",
//     company: "Microsoft",
//     description: "full access to all modules",
//     date: "2025-09-23",
//     createdBy: "System",
//     updated: false,
//   },
//   {
//     id: 3,
//     name: "employee",
//     company: "Amazon",
//     description: "restricted access for employees",
//     date: "2025-09-23",
//     createdBy: "HR",
//     updated: true,
//   },
// ];

// export default function RoleTable() {
//   const [roles, setRoles] = useState(initialRoles);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [expandedRows, setExpandedRows] = useState([]);

//   // Add/Edit role dialog
//   const [open, setOpen] = useState(false);
//   const [editingRole, setEditingRole] = useState(null);
//   const [newRole, setNewRole] = useState({ name: "", company: "", description: "" });
//   const [formErrors, setFormErrors] = useState({});

//   // Delete confirmation
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);

//   // Alerts
//     const [tenant, setTenant] = useState(null);
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertData, setAlertData] = useState({
//     title: "",
//     description: "",
//     type: "success",
//   });

//   useEffect(() => {
//      if (typeof window !== "undefined") {
//        const savedTenant = localStorage.getItem("themecode");
//        setTenant(savedTenant);
 
//      }
//    }, []);

//   const router = useRouter();
//   const itemsPerPage = 10;

//   // Filter roles
//   const filteredData = roles.filter(
//     (role) =>
//       role.name.toLowerCase().includes(search.toLowerCase()) ||
//       role.company.toLowerCase().includes(search.toLowerCase()) ||
//       (role.description &&
//         role.description.toLowerCase().includes(search.toLowerCase()))
//   );

//   // Sort
//   const sortedData = useMemo(() => {
//     if (!sortConfig.key) return filteredData;
//     return [...filteredData].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key])
//         return sortConfig.direction === "asc" ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key])
//         return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // Pagination
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const toggleExpandRow = (id) => {
//     setExpandedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const showAlert = (title, description, type = "success") => {
//     setAlertData({ title, description, type });
//     setAlertOpen(true);
//   };

//   const handleAddOrUpdateRole = () => {
//     try {
//       setFormErrors({});
//       roleSchema.parse(newRole);

//       const currentDate = new Date().toISOString().split("T")[0];

//       if (editingRole) {
//         setRoles((prev) =>
//           prev.map((r) =>
//             r.id === editingRole.id ? { ...r, ...newRole } : r
//           )
//         );
//         showAlert("Success", `${newRole.name} updated successfully!`);
//       } else {
//         setRoles((prev) => [
//           ...prev,
//           {
//             id: prev.length + 1,
//             ...newRole,
//             date: currentDate,
//             createdBy: "You",
//             updated: false,
//           },
//         ]);
//         showAlert("Success", `${newRole.name} added successfully!`);
//       }

//       setNewRole({ name: "", company: "", description: "" });
//       setEditingRole(null);
//       setOpen(false);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         setFormErrors(error.flatten().fieldErrors);
//       } else {
//         showAlert("Error", "Something went wrong", "error");
//         console.error(error);
//       }
//     }
//   };

//   const handleDeleteRole = () => {
//     setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
//     setDeleteDialogOpen(false);
//     showAlert("Deleted", `${roleToDelete.name} has been deleted!`, "success");
//   };

//   return (
//     <div className="space-y-6 p-4 ">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center gap-4">
//         <Input
//           placeholder="Search roles..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button
//               className="flex items-center gap-2"
//               onClick={() => {
//                 setEditingRole(null);
//                 setNewRole({ name: "", company: "", description: "" });
//               }}
//             >
//               <Plus className="w-4 h-4" /> Add Role
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 {editingRole ? "Edit Role" : "Add Role"}
//               </DialogTitle>
//             </DialogHeader>

//             <div className="flex flex-col gap-3 mb-3">
//               {/* Role Name */}
//               <div>
//                 <label className="block mb-1 font-medium">Role Name</label>
//                 <Input
//                   placeholder="Role Name"
//                   value={newRole.name}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, name: e.target.value })
//                   }
//                 />
//                 {formErrors.name && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
//                 )}
//               </div>

//               {/* Company */}
//               <div>
//                 <label className="block mb-1 font-medium">Company</label>
//                 <Input
//                   placeholder="Company Name"
//                   value={newRole.company}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, company: e.target.value })
//                   }
//                 />
//                 {formErrors.company && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {formErrors.company}
//                   </p>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium">Description</label>
//                 <Input
//                   placeholder="Description"
//                   value={newRole.description}
//                   onChange={(e) =>
//                     setNewRole({ ...newRole, description: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddOrUpdateRole}>
//                 {editingRole ? "Update" : "Add"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full rounded-md">
//       <Table className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900 ">
//   <TableHeader className="bg-gray-50 dark:bg-gray-800">
//     <TableRow>
//       {/* Plus button visible only on mobile */}
//       <TableHead className="md:hidden"></TableHead>
//       <TableHead>ID</TableHead>
//       <TableHead>Role Name</TableHead>
//       {/* Desktop only columns */}
//       <TableHead className="hidden md:table-cell">Company</TableHead>
//       <TableHead className="hidden md:table-cell">Description</TableHead>
//       <TableHead className="hidden md:table-cell">Date Added</TableHead>
//       <TableHead className="hidden md:table-cell">Action</TableHead>
//     </TableRow>
//   </TableHeader>

//   <TableBody>
//     {paginatedData.map((role, index) => {
//       const isExpanded = expandedRows.includes(role.id);
//       return (
//         <React.Fragment key={role.id}>
//           <TableRow
//             className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//               index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
//             }`}
//           >
//             {/* Plus button only on mobile */}
//             <TableCell className="md:hidden">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => toggleExpandRow(role.id)}
//               >
//                 {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//               </Button>
//             </TableCell>

//             <TableCell>{role.id}</TableCell>
//             <TableCell>{role.name}</TableCell>

//             {/* Desktop only columns */}
//             <TableCell className="hidden md:table-cell">{role.company}</TableCell>
//             <TableCell className="hidden md:table-cell">{role.description || "-"}</TableCell>
//             <TableCell className="hidden md:table-cell">{role.date}</TableCell>
//             <TableCell className="hidden md:table-cell gap-2">
//               {/* Edit */}
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 onClick={() => {
//                   setEditingRole(role);
//                   setNewRole({
//                     name: role.name,
//                     company: role.company,
//                     description: role.description,
//                   });
//                   setOpen(true);
//                 }}
//               >
//                 <Edit className="w-4 h-4 text-blue-600" />
//               </Button>

//               {/* Delete */}
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 onClick={() => {
//                   setRoleToDelete(role);
//                   setDeleteDialogOpen(true);
//                 }}
//               >
//                 <Trash className="w-4 h-4 text-red-600" />
//               </Button>

//               {/* Role Permission */}
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 onClick={() =>
//                   router.push(`/${tenant}/dashboard/department&role/roles/${role.id}`)
//                 }
//               >
//                 <Key className="w-4 h-4 text-green-600" />
//               </Button>
//             </TableCell>
//           </TableRow>

//           {/* Mobile expanded details */}
//           {isExpanded && (
//             <TableRow className="bg-gray-100 dark:bg-gray-800 md:hidden">
//               <TableCell colSpan={7} className="p-4">
//                 <div className="grid grid-cols-1 gap-2 text-sm">
//                   <div>
//                     <strong>Company:</strong> {role.company}
//                   </div>
//                   <div className=" whitespace-break-spaces">
//                     <strong>Description:</strong> {role.description || "-"}
//                   </div>
//                   <div>
//                     <strong>Date Added:</strong> {role.date}
//                   </div>
//                   <div className="flex gap-2 mt-2">
//                     {/* Edit */}
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => {
//                         setEditingRole(role);
//                         setNewRole({
//                           name: role.name,
//                           company: role.company,
//                           description: role.description,
//                         });
//                         setOpen(true);
//                       }}
//                     >
//                       <Edit className="w-4 h-4 text-blue-600" />
//                     </Button>

//                     {/* Delete */}
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => {
//                         setRoleToDelete(role);
//                         setDeleteDialogOpen(true);
//                       }}
//                     >
//                       <Trash className="w-4 h-4 text-red-600" />
//                     </Button>

//                     {/* Role Permission */}
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() =>
//                         router.push(`/${tenant}/dashboard/department&role/roles/${role.id}`)
//                       }
//                     >
//                       <Key className="w-4 h-4 text-green-600" />
//                     </Button>
//                   </div>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//         </React.Fragment>
//       );
//     })}
//   </TableBody>
// </Table>

//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//         >
//           Previous
//         </Button>
//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Delete Confirmation */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>
//           <p>
//             Are you sure you want to delete role{" "}
//             <strong>{roleToDelete?.name}</strong>?
//           </p>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteRole}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Alert */}
//       <AlertDialog
//         open={alertOpen}
//         onOpenChange={setAlertOpen}
//         title={alertData.title}
//         description={alertData.description}
//         type={alertData.type}
//         autoClose={2000}
//       />
//     </div>
//   );
// }




//******************************************************************************** */

// "use client";

// import { useState, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus } from "lucide-react";
// import AlertDialog from "@/components/molecules/alerts/AlertDialog";
// import { z } from "zod";

// // Validation schema
// const roleSchema = z.object({
//   name: z.string().min(1, "Role Name is required"),
//   description: z.string().optional(),
// });

// // Initial data
// const initialRoles = [
//   { id: 1, name: "manager", description: "specific grant access to this role", date: "2025-09-23" },
//   { id: 2, name: "admin", description: "full access to all modules", date: "2025-09-23" },
//   { id: 3, name: "employee", description: "restricted access for employees", date: "2025-09-23" },
// ];

// export default function RoleTable() {
//   const [roles, setRoles] = useState(initialRoles);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [open, setOpen] = useState(false);

//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertData, setAlertData] = useState({ title: "", description: "", type: "success" });

//   const [newRole, setNewRole] = useState({ name: "", description: "" });
//   const [formErrors, setFormErrors] = useState({});
//   const itemsPerPage = 10;

//   // Filter roles
//   const filteredData = roles.filter(
//     (role) =>
//       role.name.toLowerCase().includes(search.toLowerCase()) ||
//       (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
//   );

//   // Sort
//   const sortedData = useMemo(() => {
//     if (!sortConfig.key) return filteredData;
//     return [...filteredData].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // Pagination
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const toggleRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const toggleAll = () => {
//     if (selectedRows.length === paginatedData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(paginatedData.map((row) => row.id));
//     }
//   };

//   const showAlert = (title, description, type = "success") => {
//     setAlertData({ title, description, type });
//     setAlertOpen(true);
//   };

//   const handleAddRole = () => {
//     try {
//       setFormErrors({});
//       roleSchema.parse(newRole);

//       const currentDate = new Date().toISOString().split("T")[0];

//       setRoles((prev) => [
//         ...prev,
//         { id: prev.length + 1, ...newRole, date: currentDate },
//       ]);

//       showAlert("Success", `${newRole.name} added successfully!`, "success");
//       setNewRole({ name: "", description: "" });
//       setOpen(false);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         setFormErrors(error.flatten().fieldErrors);
//       } else {
//         showAlert("Error", "Something went wrong", "error");
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center">
//         <Input
//           placeholder="Search roles..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="flex items-center gap-2">
//               <Plus className="w-4 h-4" /> Add Role
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Role</DialogTitle>
//             </DialogHeader>

//             <div className="flex flex-col gap-3 mb-3">
//               {/* Role Name */}
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Role Name
//                 </label>
//                 <Input
//                   placeholder="Role Name"
//                   value={newRole.name}
//                   onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
//                 />
//                 {formErrors.name && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Description
//                 </label>
//                 <Input
//                   placeholder="Description"
//                   value={newRole.description}
//                   onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddRole}>Add</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[700px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               <TableHead>
//                 <Checkbox
//                   checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
//                   indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
//                   onCheckedChange={toggleAll}
//                 />
//               </TableHead>
//               <TableHead onClick={() => handleSort("id")} className="cursor-pointer">
//                 ID
//               </TableHead>
//               <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
//                 Role Name
//               </TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Date Added</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((role, index) => (
//               <TableRow
//                 key={role.id}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                   index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 <TableCell>
//                   <Checkbox
//                     checked={selectedRows.includes(role.id)}
//                     onCheckedChange={() => toggleRow(role.id)}
//                   />
//                 </TableCell>
//                 <TableCell>{role.id}</TableCell>
//                 <TableCell>{role.name}</TableCell>
//                 <TableCell>{role.description || "-"}</TableCell>
//                 <TableCell>{role.date}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//         >
//           Previous
//         </Button>
//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Alert */}
//       <AlertDialog
//         open={alertOpen}
//         onOpenChange={setAlertOpen}
//         title={alertData.title}
//         description={alertData.description}
//         type={alertData.type}
//         autoClose={2000}
//       />
//     </div>
//   );
// }
