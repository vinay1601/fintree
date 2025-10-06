"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import AlertDialog from "@/components/molecules/alerts/AlertDialog";
import { z } from "zod";

// Zod schema
const companySchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  themeColor: z.string().min(1, "Theme Color is required"),
  adminName: z.string().min(1, "Admin Name is required"),
  adminEmail: z.string().email("Valid email required"),
  adminPassword: z.string().min(4, "Password must be at least 4 characters"),
});

export default function CompanyTable() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [companyToDelete, setCompanyToDelete] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    description: "",
    type: "success",
  });

  // Add company state
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    logoUrl: "",
    themeColor: "#ffffff",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Edit company state
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editCompany, setEditCompany] = useState({
    companyName: "",
    logoUrl: "",
    themeColor: "#ffffff",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const itemsPerPage = 10;

  // Fetch all companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        showAlert("Error", "No access token found. Please login.", "error");
        return;
      }

      const res = await fetch(`${baseURL}/companies`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
        // Token expired or unauthorized
        showAlert(
          "Session Expired",
          "Your session has expired. Please login again.",
          "error"
        );

        // Clear session storage completely
        sessionStorage.clear();
        localStorage.clear(); // in case you stored anything there

        // Redirect to login page
        router.push("/login");
      } else {
        const errMsg = `HTTP error! status: ${res.status}`;
        showAlert("Error", errMsg, "error");
      }
        // const errMsg = `HTTP error! status: ${res.status}`;
        // showAlert("Error", errMsg, "error");
        // throw new Error(errMsg);
      }

      const json = await res.json();

      const mapped = json.map((item) => ({
        id: item.id,
        companyName: item.name,
        logoUrl: item.logo_url,
        themeColor: item.theme_color,
        created_at: item.created_at,
        domain: item.domain || "-",
        username: item.username || "-",
        password: item.password || "-",
      }));

      setData(mapped);
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (!(error instanceof Error)) {
        showAlert(
          "Error",
          "Something went wrong while fetching companies",
          "error"
        );
      }
    }
  };

  // Add company
  const handleAddCompany = async () => {
    try {
      const result = companySchema.safeParse(newCompany);
      if (!result.success) {
        const errors = {};
        result.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
        return;
      }

      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        showAlert("Error", "No access token found. Please login.", "error");
        return;
      }

      const res = await fetch(`${baseURL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCompany.companyName,
          logo_url: newCompany.logoUrl,
          theme_color: newCompany.themeColor,
          admin_name: newCompany.adminName,
          admin_email: newCompany.adminEmail,
          admin_password: newCompany.adminPassword,
        }),
      });

      if (!res.ok) {
        const errMsg = `HTTP error! status: ${res.status}`;
        showAlert("Error", errMsg, "error");
        return;
      }

      const created = await res.json();
      setData((prev) => [
        ...prev,
        {
          id: created.id,
          companyName: created.name,
          logoUrl: created.logo_url,
          themeColor: created.theme_color,
          created_at: created.created_at,
          domain: "-",
          username: created.admin_name,
          password: "••••••",
        },
      ]);

      showAlert("Success", "Company added successfully", "success");
      setOpen(false);
      setNewCompany({
        companyName: "",
        logoUrl: "",
        themeColor: "#ffffff",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
      setFormErrors({});
       await fetchCompanies(); 
    } catch (err) {
      console.error("Add company failed:", err);
      showAlert("Error", "Failed to add company", "error");
    }
  };

  // Edit company
  const handleEditClick = async (id) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        showAlert("Error", "No access token found. Please login.", "error");
        return;
      }

      const res = await fetch(`${baseURL}/companies/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errMsg = `HTTP error! status: ${res.status}`;
        showAlert("Error", errMsg, "error");
        return;
      }

      const data = await res.json();

      setEditCompany({
        companyName: data.name,
        logoUrl: data.logo_url,
        themeColor: data.theme_color,
      });

      setEditCompanyId(id);
      setEditDialogOpen(true);
      setEditFormErrors({});
    } catch (err) {
      console.error("Failed to fetch company:", err);
      showAlert("Error", "Failed to load company data", "error");
    }
  };

  const handleUpdateCompany = async () => {
    try {
      const result = companySchema.safeParse(editCompany);
      if (!result.success) {
        const errors = {};
        result.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setEditFormErrors(errors);
        return;
      }

      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        showAlert("Error", "No access token found. Please login.", "error");
        return;
      }

      const res = await fetch(
        `${baseURL}/companies/${editCompanyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editCompany.companyName,
            logo_url: editCompany.logoUrl,
            theme_color: editCompany.themeColor,
            admin_name: editCompany.adminName,
            admin_email: editCompany.adminEmail,
            admin_password: editCompany.adminPassword || undefined,
          }),
        }
      );

      if (!res.ok) {
        const errMsg = `HTTP error! status: ${res.status}`;
        showAlert("Error", errMsg, "error");
        return;
      }

      const updated = await res.json();

      setData((prev) =>
        prev.map((c) =>
          c.id === editCompanyId
            ? {
                ...c,
                companyName: updated.name,
                logoUrl: updated.logo_url,
                themeColor: updated.theme_color,
                username: updated.admin_name,
              }
            : c
        )
      );

      showAlert("Success", "Company updated successfully", "success");
      setEditDialogOpen(false);
       await fetchCompanies(); 
    } catch (err) {
      console.error("Update failed:", err);
      showAlert("Error", "Failed to update company", "error");
    }
  };

  const handleDeleteCompany = async (id) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      showAlert("Error", "No access token found. Please login.", "error");
      return;
    }

    const res = await fetch(`${baseURL}/companies/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errMsg = `HTTP error! status: ${res.status}`;
      showAlert("Error", errMsg, "error");
      return;
    }

    setData((prev) => prev.filter((company) => company.id !== id));
    showAlert("Success", "Company deleted successfully", "success");
     await fetchCompanies(); 
  } catch (err) {
    console.error("Delete failed:", err);
    showAlert("Error", "Failed to delete company", "error");
  }
};

  

  // Filter, sort, pagination logic remains unchanged
  const filteredData = data.filter(
    (item) =>
      item.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      item.domain?.toLowerCase().includes(search.toLowerCase()) ||
      item.logoUrl?.toLowerCase().includes(search.toLowerCase()) ||
      item.themeColor?.toLowerCase().includes(search.toLowerCase()) ||
      item.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.password?.toLowerCase().includes(search.toLowerCase())
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id));
    }
  };

  const showAlert = (title, description, type = "success") => {
    setAlertData({ title, description, type });
    setAlertOpen(true);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar & Add Dialog */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Company
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {[
                { key: "companyName", placeholder: "Company Name" },
                { key: "logoUrl", placeholder: "Logo URL" },
                { key: "themeColor", placeholder: "Theme Color" },
                { key: "adminName", placeholder: "Admin Name" },
                { key: "adminEmail", placeholder: "Admin Email" },
                {
                  key: "adminPassword",
                  placeholder: "Admin Password",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.key}>
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={newCompany[field.key]}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        [field.key]: e.target.value,
                      })
                    }
                  />
                  {formErrors[field.key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <Table className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={
                    selectedRows.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < paginatedData.length
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead onClick={() => handleSort("id")}>ID</TableHead>
              <TableHead onClick={() => handleSort("companyName")}>
                Company Name
              </TableHead>
              <TableHead>Logo Url</TableHead>
              <TableHead>Theme Color</TableHead>
              <TableHead>Create At</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id || `company-${index}`}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onCheckedChange={() => toggleRow(item.id)}
                  />
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.companyName}</TableCell>
                <TableCell>{item.logoUrl}</TableCell>
                <TableCell>
                  <Badge
                    style={{ backgroundColor: item.themeColor, color: "#000" }}
                    className="px-2 py-1 rounded-full"
                  >
                    {item.themeColor}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{item.domain}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClick(item.id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
    setCompanyToDelete(item); // store company to delete
    setDeleteDialogOpen(true); // open dialog
  }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
        <span>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { key: "companyName", placeholder: "Company Name" },
              { key: "logoUrl", placeholder: "Logo URL" },
              { key: "themeColor", placeholder: "Theme Color" },
              { key: "adminName", placeholder: "Admin Name" },
              { key: "adminEmail", placeholder: "Admin Email" },
              {
                key: "adminPassword",
                placeholder: "Admin Password",
                type: "password",
              },
            ].map((field) => (
              <div key={field.key}>
                <Input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={editCompany[field.key] ?? ""}
                  onChange={(e) =>
                    setEditCompany({
                      ...editCompany,
                      [field.key]: e.target.value,
                    })
                  }
                />
                {editFormErrors[field.key] && (
                  <p className="text-red-500 text-sm mt-1">
                    {editFormErrors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCompany}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
{/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Delete</DialogTitle>
    </DialogHeader>
    <p>Are you sure you want to delete <b>{companyToDelete?.companyName}</b>?</p>
    <DialogFooter className="flex gap-2">
      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          handleDeleteCompany(companyToDelete.id);
          setDeleteDialogOpen(false);
        }}
      >
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

//*********************************working code 3-10-25****************************************** */
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
// import { Badge } from "@/components/ui/badge";
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

// // Zod validation schema
// const companySchema = z.object({
//   companyName: z.string().min(1, "Company Name is required"),
//   domain: z
//     .string()
//     .min(1, "Domain is required")
//     .refine((val) => {
//       return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(val);
//     }, "Invalid domain format"),
//   logoUrl: z.string().url("Invalid Logo URL").min(1, "Logo URL is required"),
//   themeColor: z.string().min(1, "Theme Color is required"),
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(1, "Password is required"),
// });

// // Initial sample data
// const initialData = [
//   {
//     id: 1,
//     companyName: "Tech Solutions",
//     domain: "techsolutions.com",
//     logoUrl: "https://techsolutions.com/logo.png",
//     themeColor: "#1a73e8",
//     username: "john_doe",
//     password: "p@ssw0rd",
//   },
//   {
//     id: 2,
//     companyName: "Green Energy",
//     domain: "greenenergy.org",
//     logoUrl: "https://greenenergy.org/logo.png",
//     themeColor: "#28a745",
//     username: "alice_smith",
//     password: "12345",
//   },
// ];

// export default function CompanyTable() {
//   const [data, setData] = useState(initialData);
//   const [search, setSearch] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [open, setOpen] = useState(false);

//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertData, setAlertData] = useState({
//     title: "",
//     description: "",
//     type: "success",
//   });

//   const [newCompany, setNewCompany] = useState({
//     companyName: "",
//     domain: "",
//     logoUrl: "",
//     themeColor: "#ffffff",
//     username: "",
//     password: "",
//   });

//   const [formErrors, setFormErrors] = useState({});

//   const itemsPerPage = 10;

//   // Filter data
//   const filteredData = data.filter(
//     (item) =>
//       item.companyName.toLowerCase().includes(search.toLowerCase()) ||
//       item.domain.toLowerCase().includes(search.toLowerCase()) ||
//       item.logoUrl.toLowerCase().includes(search.toLowerCase()) ||
//       item.themeColor.toLowerCase().includes(search.toLowerCase()) ||
//       item.username.toLowerCase().includes(search.toLowerCase()) ||
//       item.password.toLowerCase().includes(search.toLowerCase())
//   );

//   // Sort data
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

//   // Sort handler
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   // Checkbox handlers
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

//   // Add company with Zod validation and inline error messages
//  const handleAddCompany = () => {
//   try {
//     setFormErrors({});
//     companySchema.parse(newCompany);

//     setData((prev) => [...prev, { id: prev.length + 1, ...newCompany }]);
//     showAlert("Success", `${newCompany.companyName} added successfully!`, "success");

//     // Reset form
//     setNewCompany({
//       companyName: "",
//       domain: "",
//       logoUrl: "",
//       themeColor: "#ffffff",
//       username: "",
//       password: "",
//     });

//     setOpen(false);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       // Flatten returns { fieldErrors, formErrors }
//       const flattened = error.flatten();
//       setFormErrors(flattened.fieldErrors);
//     } else {
//       showAlert("Error", "Something went wrong", "error");
//       console.error(error);
//     }
//   }
// };

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
//               <Plus className="w-4 h-4" /> Add Company
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Company</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-3">
//               {["companyName","domain","logoUrl","themeColor","username","password"].map((field) => (
//                 <div key={field}>
//                   <Input
//                     placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
//                     value={newCompany[field]}
//                     onChange={(e) => setNewCompany({ ...newCompany, [field]: e.target.value })}
//                   />
//                   {formErrors[field] && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//               <Button onClick={handleAddCompany}>Add</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[900px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               <TableHead>
//                 <Checkbox
//                   checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
//                   indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
//                   onCheckedChange={toggleAll}
//                 />
//               </TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>ID</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("companyName")}>Company Name</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("domain")}>Domain</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("logoUrl")}>Logo Url</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("themeColor")}>Theme Color</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>User Name</TableHead>
//               <TableHead className="cursor-pointer" onClick={() => handleSort("password")}>Password</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item, index) => (
//               <TableRow key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}>
//                 <TableCell>
//                   <Checkbox
//                     checked={selectedRows.includes(item.id)}
//                     onCheckedChange={() => toggleRow(item.id)}
//                   />
//                 </TableCell>
//                 <TableCell>{item.id}</TableCell>
//                 <TableCell>{item.companyName}</TableCell>
//                 <TableCell>{item.domain}</TableCell>
//                 <TableCell>{item.logoUrl}</TableCell>
//                 <TableCell>
//                   <Badge style={{ backgroundColor: item.themeColor, color: "#000" }} className="px-2 py-1 rounded-full">
//                     {item.themeColor}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>{item.username}</TableCell>
//                 <TableCell>{item.password}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
//       </div>

//       {/* Alert Dialog */}
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
