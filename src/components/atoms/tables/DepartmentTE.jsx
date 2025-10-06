"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
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
import { Plus, Minus, Trash2 } from "lucide-react";
import AlertDialog from "@/components/molecules/alerts/AlertDialog";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";

// ✅ Zod validation schema
const departmentSchema = z.object({
  departmentName: z.string().min(1, "Department Name is required"),
  subDepartment: z.string().optional(),
});

export default function DepartmentTable() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
  const [data, setData] = useState([]); // fetched data
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    description: "",
    type: "success",
  });
  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
    subDepartment: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const itemsPerPage = 10;
  const [expandedRows, setExpandedRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
       const [id, setId] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
   useEffect(()=>{
if (typeof window !== "undefined") {
      const companyId = sessionStorage.getItem("companyId");
      setId(companyId);
    }
   },[])

  // ✅ Alert helper
  const showAlert = (title, description, type = "success") => {
    setAlertData({ title, description, type });
    setAlertOpen(true);
  };

  // ✅ Delete department
  const confirmDelete = (item) => {
    setDepartmentToDelete(item);
    setDeleteDialogOpen(true);
  };

const handleDeleteDepartment = async () => {
  if (!departmentToDelete) return;

  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      showAlert("Error", "Not authenticated, please log in again", "error");
      return;
    }

    const res = await fetch(
      `${baseURL}/departments/${departmentToDelete.ID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseText = await res.text();
    console.log("Delete API response:", res.status, responseText);

    if (!res.ok) {
      showAlert(
        "Error",
        `Failed to delete department: ${res.status} ${responseText}`,
        "error"
      );
      return;
    }

    // Remove from local state if successful
    setData((prev) =>
      prev.filter((item) => item.ID !== departmentToDelete.ID)
    );
    showAlert(
      "Deleted",
      `${departmentToDelete.Department} deleted successfully!`,
      "success"
    );
    setDeleteDialogOpen(false);
    setDepartmentToDelete(null);
  } catch (error) {
    console.error(error);
    showAlert("Error", `Failed to delete: ${error.message}`, "error");
  }
};



  // ✅ Filter + Sort + Paginate
  const filteredData = data.filter(
    (item) =>
      item.Department?.toLowerCase().includes(search.toLowerCase()) ||
      (item["Sub-Department"] &&
        item["Sub-Department"].toLowerCase().includes(search.toLowerCase()))
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // ✅ Add Department (API integrated)
  const handleAddDepartment = async () => {
    try {
      setFormErrors({});
      departmentSchema.parse(newDepartment);

      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        showAlert("Error", "Not authenticated, please log in again", "error");
        return;
      }

      const payload = {
        name: newDepartment.departmentName,
        parent_id: newDepartment.subDepartment
          ? parseInt(newDepartment.subDepartment)
          : null,
        company_id: id, 
      };

      const res = await fetch(`${baseURL}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create department");
      }

      const created = await res.json();

      setData((prev) => [
        ...prev,
        {
          ID: created.id,
          Department: created.name,
          "Sub-Department": created.parent_id ? created.parent_id : "-",
          "Date Added": created.created_at
            ? format(new Date(created.created_at), "d MMM yyyy, h:mm a")
            : "-",
        },
      ]);

      showAlert("Success", `${created.name} added successfully!`, "success");
      setNewDepartment({ departmentName: "", subDepartment: "" });
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors(error.flatten().fieldErrors);
      } else {
        console.error(error);
        showAlert("Error", "Failed to add department", "error");
      }
    }
  };

  // ✅ Fetch Departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          showAlert("Error", "No token found, please log in again", "error");
          return;
        }

        const res = await fetch(`${baseURL}/departments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          sessionStorage.clear();
           router.push(`/login`);
          showAlert("Error", "Session expired, please log in again", "error");
          sessionStorage.removeItem("accessToken");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch departments: ${res.status}`);
        }

        const json = await res.json();

        const mapped = json.map((dept) => ({
  ID: dept.id,
  Department: dept.name,
  parent_name: dept.parent_name || "-", // ✅ use parent_name from API
  "Date Added": dept.created_at
    ? format(new Date(dept.created_at), "d MMM yyyy, h:mm a")
    : "-",
}));

        setData(mapped);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setData([]);
        showAlert("Error", "Failed to load departments", "error");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Department
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Department / Sub-Department</DialogTitle>
            </DialogHeader>

            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="block mb-1 font-medium">
                  Department Name
                </label>
                <Input
                  placeholder="Department Name"
                  value={newDepartment.departmentName}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      departmentName: e.target.value,
                    })
                  }
                />
                {formErrors.departmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.departmentName}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-medium">
                  Parent Department
                </label>
                <Select
                  value={newDepartment.subDepartment || "none"}
                  onValueChange={(val) =>
                    setNewDepartment({
                      ...newDepartment,
                      subDepartment: val === "none" ? "" : val,
                    })
                  }
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select Parent Department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {data.map((dept) => (
                      <SelectItem key={dept.ID} value={String(dept.ID)}>
                        {dept.Department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full rounded-md">
 <Table className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-center align-middle">

          <TableHeader className="bg-gray-50 dark:bg-gray-800">
  <TableRow>
    <TableHead className="md:hidden"></TableHead>
    <TableHead className="text-center">ID</TableHead>
    <TableHead className="text-center">Department</TableHead>
    <TableHead className="hidden md:table-cell text-center">
      Parent-Department
    </TableHead>
    <TableHead className="hidden md:table-cell text-center">
      Created At
    </TableHead>
    <TableHead className="hidden md:table-cell text-center">
      Actions
    </TableHead>
  </TableRow>
</TableHeader>


          <TableBody>
  {paginatedData.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-4">
        No data available
      </TableCell>
    </TableRow>
  ) : (
    paginatedData.map((item) => {
      const isExpanded = expandedRows.includes(item.ID);

      return (
        <React.Fragment key={item.ID}>
          <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <TableCell className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpandRow(item.ID)}
              >
                {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>
            </TableCell>

            <TableCell>{item.ID}</TableCell>
            <TableCell>{item.Department}</TableCell>
            <TableCell className="hidden md:table-cell">
  {item.parent_name || "-"}
</TableCell>

            <TableCell className="hidden md:table-cell">
              {item["Date Added"]}
            </TableCell>

            <TableCell className="hidden md:table-cell gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => confirmDelete(item)}
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>

          {isExpanded && (
            <TableRow className="bg-gray-100 dark:bg-gray-800 md:hidden">
              <TableCell colSpan={6} className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <strong>Sub-Department:</strong>   {item.parent_name || "-"}
                  </div>
                  <div>
                    <strong>Created At:</strong> {item["Date Added"]}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(item)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    })
  )}
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
        <span className="font-medium">
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

      {/* Alert */}
      <AlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertData.title}
        description={alertData.description}
        type={alertData.type}
        autoClose={2000}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            Are you sure you want to delete department{" "}
            <strong>{departmentToDelete?.Department}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

//**************************workong code 4-10-25************************************/
// "use client";

// import React from "react";
// import { useState, useMemo } from "react";
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
// import { Plus, Minus, Edit, Trash2 } from "lucide-react";
// import AlertDialog from "@/components/molecules/alerts/AlertDialog";
// import { z } from "zod";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// // Zod validation schema
// const departmentSchema = z.object({
//   departmentName: z.string().min(1, "Department Name is required"),
//   subDepartment: z.string().optional(),
// });

// // Initial data
// const initialData = [
//   {
//     ID: "1",
//     Department: "Human Resources",
//     "Sub-Department": "Recruitment",
//     "Date Added": "2025-01-15",
//     "Date Edited": "2025-06-10",
//     Phone: "+91-9876543210",
//     Email: "hr.recruitment@example.com",
//     Address: "123, Corporate Avenue, Mumbai, India",
//     Updated: true,
//     "Created By": "Admin",
//   },
//   {
//     ID: "2",
//     Department: "Finance",
//     "Sub-Department": "Accounts Payable",
//     "Date Added": "2025-02-20",
//     "Date Edited": "2025-07-12",
//     Phone: "+91-9123456780",
//     Email: "finance.ap@example.com",
//     Address: "456, Money Street, Delhi, India",
//     Updated: false,
//     "Created By": "Admin",
//   },
//   {
//     ID: "3",
//     Department: "IT",
//     "Sub-Department": "Support",
//     "Date Added": "2025-03-05",
//     "Date Edited": "2025-08-01",
//     Phone: "+91-9988776655",
//     Email: "it.support@example.com",
//     Address: "789, Tech Park, Bengaluru, India",
//     Updated: true,
//     "Created By": "Manager",
//   },
//   {
//     ID: "4",
//     Department: "Marketing",
//     "Sub-Department": "Digital Marketing",
//     "Date Added": "2025-04-10",
//     "Date Edited": "2025-08-20",
//     Phone: "+91-9876501234",
//     Email: "marketing.digital@example.com",
//     Address: "321, Media Lane, Pune, India",
//     Updated: false,
//     "Created By": "Admin",
//   },
// ];

// export default function DepartmentTable() {
//   const [data, setData] = useState(initialData);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [open, setOpen] = useState(false);
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertData, setAlertData] = useState({
//     title: "",
//     description: "",
//     type: "success",
//   });
//   const [newDepartment, setNewDepartment] = useState({
//     departmentName: "",
//     subDepartment: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const itemsPerPage = 10;

//   // Expanded row state
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [departmentToDelete, setDepartmentToDelete] = useState(null);

//   const confirmDelete = (item) => {
//     setDepartmentToDelete(item);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteDepartment = () => {
//     if (!departmentToDelete) return;

//     setData((prev) => prev.filter((item) => item.ID !== departmentToDelete.ID));
//     showAlert(
//       "Deleted",
//       `${departmentToDelete.Department} deleted successfully!`,
//       "success"
//     );
//     setDeleteDialogOpen(false);
//     setDepartmentToDelete(null);
//   };

//   // Filter data
//   const filteredData = data.filter(
//     (item) =>
//       item.Department.toLowerCase().includes(search.toLowerCase()) ||
//       (item["Sub-Department"] &&
//         item["Sub-Department"].toLowerCase().includes(search.toLowerCase()))
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

//   const toggleExpandRow = (id) => {
//     setExpandedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const showAlert = (title, description, type = "success") => {
//     setAlertData({ title, description, type });
//     setAlertOpen(true);
//   };

//   const handleAddDepartment = () => {
//     try {
//       setFormErrors({});
//       departmentSchema.parse(newDepartment);

//       const currentDate = new Date().toISOString().split("T")[0];

//       setData((prev) => [
//         ...prev,
//         {
//           ID: prev.length + 1,
//           Department: newDepartment.departmentName,
//           "Sub-Department": newDepartment.subDepartment || "-",
//           "Date Added": currentDate,
//           "Date Edited": currentDate,
//           Phone: "-",
//           Email: "-",
//           Address: "-",
//           Updated: true,
//           "Created By": "Admin",
//         },
//       ]);

//       showAlert(
//         "Success",
//         `${newDepartment.departmentName} added successfully!`,
//         "success"
//       );
//       setNewDepartment({ departmentName: "", subDepartment: "" });
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
//       <div className="flex justify-between items-center gap-4">
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="flex items-center gap-2">
//               <Plus className="w-4 h-4" /> Add Department
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Department / Sub-Department</DialogTitle>
//             </DialogHeader>

//             <div className="flex gap-3 mb-3">
//               <div className="flex-1">
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Department Name
//                 </label>
//                 <Input
//                   placeholder="Department Name"
//                   value={newDepartment.departmentName}
//                   onChange={(e) =>
//                     setNewDepartment({
//                       ...newDepartment,
//                       departmentName: e.target.value,
//                     })
//                   }
//                 />
//                 {formErrors.departmentName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {formErrors.departmentName}
//                   </p>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Parent Department
//                 </label>
//                 <Select
//                   value={newDepartment.subDepartment || "none"}
//                   onValueChange={(val) =>
//                     setNewDepartment({
//                       ...newDepartment,
//                       subDepartment: val === "none" ? "" : val,
//                     })
//                   }
//                 >
//                   <SelectTrigger className="w-full h-12">
//                     <SelectValue placeholder="Select Parent Department (optional)" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     {data.map((dept) => (
//                       <SelectItem key={dept.ID} value={dept.Department}>
//                         {dept.Department}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddDepartment}>Add</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full rounded-md">
//         <Table className=" border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               {/* Expand button column only on mobile */}
//               <TableHead className="md:hidden"></TableHead>

//               <TableHead>ID</TableHead>
//               <TableHead>Department</TableHead>

//               {/* Desktop-only columns */}
//               <TableHead className="hidden md:table-cell">
//                 Sub-Department
//               </TableHead>
//               <TableHead className="hidden md:table-cell">Created At</TableHead>
//               <TableHead className="hidden md:table-cell">
//                 Updated Date
//               </TableHead>
//               <TableHead className="hidden md:table-cell">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item) => {
//               const isExpanded = expandedRows.includes(item.ID);

//               return (
//                 <React.Fragment key={item.ID}>
//                   {/* Main Row */}
//                   <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                     {/* Expand button only on mobile */}
//                     <TableCell className="md:hidden">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => toggleExpandRow(item.ID)}
//                       >
//                         {isExpanded ? (
//                           <Minus className="w-4 h-4" />
//                         ) : (
//                           <Plus className="w-4 h-4" />
//                         )}
//                       </Button>
//                     </TableCell>

//                     {/* Always visible */}
//                     <TableCell>{item.ID}</TableCell>
//                     <TableCell>{item.Department}</TableCell>

//                     {/* Desktop-only columns */}
//                     <TableCell className="hidden md:table-cell">
//                       {item["Sub-Department"] || "-"}
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {item["Date Added"]}
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {item["Date Edited"]}
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => confirmDelete(item)}
//                         title="Delete"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>

//                   {/* Expanded Row for Mobile */}
//                   {isExpanded && (
//                     <TableRow className="bg-gray-100 dark:bg-gray-800 md:hidden">
//                       <TableCell colSpan={6} className="p-4">
//                         <div className="grid grid-cols-1 gap-2">
//                           <div>
//                             <strong>Sub-Department:</strong>{" "}
//                             {item["Sub-Department"] || "-"}
//                           </div>
//                           <div>
//                             <strong>Created At:</strong> {item["Date Added"]}
//                           </div>
//                           <div>
//                             <strong>Updated Date:</strong> {item["Date Edited"]}
//                           </div>
//                           <div>
//                             <strong>Phone:</strong> {item.Phone}
//                           </div>
//                           <div>
//                             <strong>Email:</strong> {item.Email}
//                           </div>
//                           <div className=" whitespace-break-spaces">
//                             <strong>Address:</strong> {item.Address}
//                           </div>
//                           <div>
//                             <strong>Updated:</strong>{" "}
//                             {item.Updated ? "Yes" : "No"}
//                           </div>
//                           <div>
//                             <strong>Created By:</strong> {item["Created By"]}
//                           </div>
//                           <div className="flex gap-2 mt-2">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => confirmDelete(item)}
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4 text-red-500" />
//                             </Button>
//                           </div>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </React.Fragment>
//               );
//             })}
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

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>
//           <p className="mt-2">
//             Are you sure you want to delete department{" "}
//             <strong>{departmentToDelete?.Department}</strong>?
//           </p>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteDepartment}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

//****************************************************************** */

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
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Plus } from "lucide-react";
// import AlertDialog from "@/components/molecules/alerts/AlertDialog";
// import { z } from "zod";

// // Zod validation schema
// const departmentSchema = z.object({
//   departmentName: z.string().min(1, "Department Name is required"),
//   subDepartment: z.string().optional(),
// });

// // Initial data
// const initialData = [
//   { id: 1, departmentName: "Engineering", subDepartment: "", date: "2025-09-17" },
//   { id: 2, departmentName: "HR", subDepartment: "", date: "2025-09-17" },
//   { id: 3, departmentName: "Frontend", subDepartment: "1", date: "2025-09-17" },
// ];

// export default function DepartmentTable() {
//   const [data, setData] = useState(initialData);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [open, setOpen] = useState(false);

//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertData, setAlertData] = useState({ title: "", description: "", type: "success" });

//   const [newDepartment, setNewDepartment] = useState({ departmentName: "", subDepartment: "" });
//   const [formErrors, setFormErrors] = useState({});
//   const itemsPerPage = 10;

//   // Filter data
//   const filteredData = data.filter(
//     (item) =>
//       item.departmentName.toLowerCase().includes(search.toLowerCase()) ||
//       (item.subDepartment &&
//         data
//           .find((d) => d.id === Number(item.subDepartment))
//           ?.departmentName.toLowerCase()
//           .includes(search.toLowerCase()))
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

//   const handleAddDepartment = () => {
//     try {
//       setFormErrors({});
//       departmentSchema.parse(newDepartment);

//       const currentDate = new Date().toISOString().split("T")[0];

//       setData((prev) => [
//         ...prev,
//         { id: prev.length + 1, ...newDepartment, date: currentDate },
//       ]);

//       showAlert("Success", `${newDepartment.departmentName} added successfully!`, "success");
//       setNewDepartment({ departmentName: "", subDepartment: "" });
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

//   const departmentsOnly = data.filter((item) => !item.subDepartment);

//   return (
//     <div className="space-y-6 p-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center">
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="flex items-center gap-2">
//               <Plus className="w-4 h-4" /> Add Department
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Department / Sub-Department</DialogTitle>
//             </DialogHeader>

//             {/* Two inputs side by side */}
//             <div className="flex gap-3 mb-3">
//               {/* Department Name */}
//               <div className="flex-1">
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Department Name
//                 </label>
//                 <Input
//                   placeholder="Department Name"
//                   value={newDepartment.departmentName}
//                   onChange={(e) =>
//                     setNewDepartment({ ...newDepartment, departmentName: e.target.value })
//                   }
//                 />
//                 {formErrors.departmentName && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.departmentName}</p>
//                 )}
//               </div>

//               {/* Sub-Department */}
//               <div className="flex-1">
//                 <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
//                   Sub-Department
//                 </label>
//                 <Select
//                   value={newDepartment.subDepartment || "none"}
//                   onValueChange={(val) =>
//                     setNewDepartment({ ...newDepartment, subDepartment: val === "none" ? "" : val })
//                   }
//                 >
//                   <SelectTrigger className="w-full h-12">
//                     <SelectValue placeholder="Select Parent Department (optional)" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     {departmentsOnly.map((dept) => (
//                       <SelectItem key={dept.id} value={String(dept.id)}>
//                         {dept.departmentName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddDepartment}>Add</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[800px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
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
//               <TableHead onClick={() => handleSort("departmentName")} className="cursor-pointer">
//                 Department
//               </TableHead>
//               <TableHead>Sub-Department</TableHead>
//               <TableHead>Date Added</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item, index) => (
//               <TableRow
//                 key={item.id}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                   index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 <TableCell>
//                   <Checkbox
//                     checked={selectedRows.includes(item.id)}
//                     onCheckedChange={() => toggleRow(item.id)}
//                   />
//                 </TableCell>
//                 <TableCell>{item.id}</TableCell>
//                 <TableCell>{item.departmentName}</TableCell>
//                 <TableCell>
//                   {item.subDepartment
//                     ? data.find((d) => d.id === Number(item.subDepartment))?.departmentName || "-"
//                     : "-"}
//                 </TableCell>
//                 <TableCell>{item.date}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
//           Previous
//         </Button>
//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
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
