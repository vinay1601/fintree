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
import { Switch } from "@/components/ui/switch";
import { Edit, Trash, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function UserTable() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Add User states
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    department_id: "",
    role_id: "",
  });

  // Dropdown data
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Edit/Delete
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users, departments, roles
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.error("No token found, please log in again");
        router.push("/login");
        return;
      }

      const res = await fetch(`${baseURL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        sessionStorage.clear();
        toast.error("Session expired, please log in again");
        router.push("/login");
        return;
      }

      const data = await res.json();
      const formattedUsers = (Array.isArray(data) ? data : [data]).map((u) => ({
        id: u.id,
        companyId: u.company_id,
        companyName: u.company_name || "—",
        roleId: u.role_id || "—",
        departmentId: u.department_id || "—",
        name: u.name,
        email: u.email,
        password: u.password_hash || "********",
        active: u.is_active,
        userType: u.user_type,
        createdAt: formatDate(u.created_at),
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching users");
    }
  };

  // ✅ Fetch Departments
  const fetchDepartments = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch(`${baseURL}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching departments");
    }
  };

  // ✅ Fetch Roles
  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch("${baseURL}/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching roles");
    }
  };

  // ✅ Handle Add User
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      const payload = {
        company_id: Number(sessionStorage.getItem("companyId") || 0),
        role_id: Number(newUser.role_id),
        department_id: Number(newUser.department_id),
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };

      const res = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const createdUser = await res.json();
      setUsers((prev) => [...prev, createdUser]);
      setNewUser({ name: "", email: "", password: "", department_id: "", role_id: "" });
      setOpen(false);
      toast.success("User added successfully!");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error creating user");
    }
  };

    const handleEditUser = () => {
    if (!editUser.name || !editUser.email || !editUser.password) {
      toast.error("Please fill all required fields");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? { ...editUser } : u))
    );
    setEditOpen(false);
    toast.success("User updated successfully!");
  };

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.companyId?.toString().toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.userType?.toLowerCase().includes(search.toLowerCase()) ||
      u.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle Active
  const handleToggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  // Delete user
  const handleDeleteUser = () => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setDeleteDialogOpen(false);
    toast.success("User deleted successfully!");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" max-w-44 md:max-w-sm"
        />

        {/* ✅ Add User Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              onClick={() => setNewUser({ name: "", email: "", password: "", department_id: "", role_id: "" })}
            >
              <Plus className="w-4 h-4" /> Add User
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 mb-3">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  placeholder="User Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <Input
                  placeholder="Password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              {/* ✅ Department Dropdown */}
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                  value={newUser.department_id}
                  onChange={(e) => setNewUser({ ...newUser, department_id: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Role Dropdown */}
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Table */}
      <div className="overflow-x-auto w-full rounded-md">
        <Table className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-center align-middle">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
  <TableRow className="text-center">
    {/* Expand button column only for mobile */}
    <TableHead className="md:hidden w-10"></TableHead>

    <TableHead className="text-center">Company ID</TableHead>
    <TableHead className="text-center">User Name</TableHead>

    {/* Extra columns only visible on md+ */}
    <TableHead className="hidden md:table-cell text-center">
      Company Name
    </TableHead>
    <TableHead className="hidden md:table-cell text-center">Password</TableHead>
    <TableHead className="hidden md:table-cell text-center">Active</TableHead>
    <TableHead className="hidden md:table-cell text-center">Email</TableHead>
    <TableHead className="hidden md:table-cell text-center">User Type</TableHead>
    <TableHead className="hidden md:table-cell text-center">Created At</TableHead>
    <TableHead className="hidden md:table-cell text-center">Action</TableHead>
  </TableRow>
</TableHeader>


          <TableBody>
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                {/* Main Row */}
                <TableRow
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition`}
                >
                  {/* Expand/Collapse icon only for mobile */}
                  <TableCell className="md:hidden">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setExpandedRow(expandedRow === user.id ? null : user.id)
                      }
                    >
                      {expandedRow === user.id ? (
                        <Minus className="w-4 h-4 text-green-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-blue-600" />
                      )}
                    </Button>
                  </TableCell>

                  <TableCell>{user.companyId}</TableCell>
                  <TableCell>{user.name}</TableCell>

                  {/* Desktop columns */}
                  <TableCell className="hidden md:table-cell">
                    {user.companyName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.showPassword ? user.password : "•".repeat(8)}
                    <button
                      onClick={() =>
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id
                              ? { ...u, showPassword: !u.showPassword }
                              : u
                          )
                        )
                      }
                      className="ml-2 text-blue-500 text-xs"
                    >
                      {user.showPassword ? "Hide" : "Show"}
                    </button>
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-center">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => handleToggleActive(user.id)}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.userType}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.createdAt}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditUser(user);
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Row (Mobile Only) */}
                {expandedRow === user.id && (
                  <TableRow className="md:hidden bg-gray-100 dark:bg-gray-800">
                    <TableCell colSpan={10}>
                      <div className="space-y-2 text-sm p-2">
                        <p>
                          <strong>Company Name:</strong> {user.companyName}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Password:</strong> {user.password}
                        </p>
                        <p>
                          <strong>User Type:</strong> {user.userType}
                        </p>
                        <p>
                          <strong>Created At:</strong> {user.createdAt}
                        </p>

                        <div className="flex items-center gap-2">
                          <strong>Active:</strong>
                          <Switch
                            checked={user.active}
                            onCheckedChange={() => handleToggleActive(user.id)}
                          />
                        </div>

                        <div className="flex gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditUser(user);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setUserToDelete(user);
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {editUser && (
            <div className="flex flex-col gap-3 mb-3">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <Input
                  type="password"
                  value={editUser.password}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete user{" "}
            <strong>{userToDelete?.email}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
//****************************************working code 6-10-25******************************************* */
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
// import { Switch } from "@/components/ui/switch";
// import { Edit, Trash, Plus, Minus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// const initialUsers = [
//   {
//     id: 1,
//     companyId: "C-101",
//     companyName: "fintree",
//     roleId: "R-01",
//     departmentId: "D-01",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     password: "********",
//     active: true,
//     userType: "Admin",
//     createdAt: "2025-09-23",
//   },
// ];

// export default function UserTable() {
//   const [users, setUsers] = useState(initialUsers);
//   const [search, setSearch] = useState("");
//   const [expandedRow, setExpandedRow] = useState(null);

//   // Add User states
//   const [open, setOpen] = useState(false);
//   const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

//   // Edit User states
//   const [editOpen, setEditOpen] = useState(false);
//   const [editUser, setEditUser] = useState(null);

//   // Delete User states
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   // Filter users
//   const filteredUsers = users.filter(
//     (u) =>
//       u.companyId.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase()) ||
//       u.userType.toLowerCase().includes(search.toLowerCase()) ||
//       u.companyName.toLowerCase().includes(search.toLowerCase())
//   );

//   // Toggle active
//   const handleToggleActive = (id) => {
//     setUsers((prev) =>
//       prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
//     );
//   };

//   // Add new user
//   const handleAddUser = () => {
//     if (!newUser.name || !newUser.email || !newUser.password) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const companyId = localStorage.getItem("companyId") || "C-000";
//     const roleId = localStorage.getItem("roleId") || "R-000";
//     const departmentId = localStorage.getItem("departmentId") || "D-000";
//     const companyName = localStorage.getItem("companyName") || "Fintree";

//     const newUserData = {
//       id: users.length + 1,
//       ...newUser,
//       companyId,
//       companyName,
//       roleId,
//       departmentId,
//       active: true,
//       userType: "Employee",
//       createdAt: new Date().toISOString().split("T")[0],
//     };

//     setUsers((prev) => [...prev, newUserData]);
//     setNewUser({ name: "", email: "", password: "" });
//     setOpen(false);

//     toast.success("User added successfully!");
//   };

//   // Edit user save
//   const handleEditUser = () => {
//     if (!editUser.name || !editUser.email || !editUser.password) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     setUsers((prev) =>
//       prev.map((u) => (u.id === editUser.id ? { ...editUser } : u))
//     );
//     setEditOpen(false);
//     toast.success("User updated successfully!");
//   };

//   // Delete user
//   const handleDeleteUser = () => {
//     setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
//     setDeleteDialogOpen(false);
//     toast.success("User deleted successfully!");
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center gap-4">
//         <Input
//           placeholder="Search users..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className=" max-w-44 md:max-w-sm"
//         />

//         {/* Add User Dialog */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button
//               className="flex items-center gap-2"
//               onClick={() => setNewUser({ name: "", email: "", password: "" })}
//             >
//               <Plus className="w-4 h-4" /> Add User
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New User</DialogTitle>
//             </DialogHeader>

//             <div className="flex flex-col gap-3 mb-3">
//               <div>
//                 <label className="block mb-1 font-medium">Name</label>
//                 <Input
//                   placeholder="User Name"
//                   value={newUser.name}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, name: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Email</label>
//                 <Input
//                   placeholder="Email Address"
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, email: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Password</label>
//                 <Input
//                   placeholder="Password"
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, password: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddUser}>Add</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full rounded-md">
//         <Table className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               <TableHead className="flex md:hidden"></TableHead> {/* Expand button */}
//               <TableHead>Company ID</TableHead>
//               <TableHead>User Name</TableHead>

//               {/* Extra columns only visible on md+ */}
//               <TableHead className="hidden md:table-cell">Company Name</TableHead>
//               <TableHead className="hidden md:table-cell">Password</TableHead>
//               <TableHead className="hidden md:table-cell text-center">Active</TableHead>
//               <TableHead className="hidden md:table-cell">Email</TableHead>
//               <TableHead className="hidden md:table-cell">User Type</TableHead>
//               <TableHead className="hidden md:table-cell">Created At</TableHead>
//               <TableHead className="hidden md:table-cell">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredUsers.map((user, index) => (
//               <React.Fragment key={user.id}>
//                 <TableRow
//                   className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                     index % 2 === 0
//                       ? "bg-white dark:bg-gray-900"
//                       : "bg-gray-50 dark:bg-gray-800"
//                   }`}
//                 >
//                   {/* Expand/Collapse button */}
//                   <TableCell className="md:hidden">
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() =>
//                         setExpandedRow(expandedRow === user.id ? null : user.id)
//                       }
//                     >
//                       {expandedRow === user.id ? (
//                         <Minus className="w-4 h-4 text-green-600" />
//                       ) : (
//                         <Plus className="w-4 h-4 text-blue-600" />
//                       )}
//                     </Button>
//                   </TableCell>

//                   <TableCell>{user.companyId}</TableCell>
//                   <TableCell>{user.name}</TableCell>

//                   {/* Desktop only */}
//                   <TableCell className="hidden md:table-cell">{user.companyName}</TableCell>
//                   <TableCell className="hidden md:table-cell">{user.password}</TableCell>
//                   <TableCell className="hidden md:table-cell text-center">
//                     <Switch
//                       checked={user.active}
//                       onCheckedChange={() => handleToggleActive(user.id)}
//                     />
//                   </TableCell>
//                   <TableCell className="hidden md:table-cell">{user.email}</TableCell>
//                   <TableCell className="hidden md:table-cell">{user.userType}</TableCell>
//                   <TableCell className="hidden md:table-cell">{user.createdAt}</TableCell>
//                   <TableCell className="hidden md:table-cell  gap-2 items-center">
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => {
//                         setEditUser(user);
//                         setEditOpen(true);
//                       }}
//                     >
//                       <Edit className="w-4 h-4 text-blue-600" />
//                     </Button>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => {
//                         setUserToDelete(user);
//                         setDeleteDialogOpen(true);
//                       }}
//                     >
//                       <Trash className="w-4 h-4 text-red-600" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>

//                 {/* Expanded row for mobile */}
//                 {expandedRow === user.id && (
//                   <TableRow className="md:hidden bg-gray-100 dark:bg-gray-800">
//                     <TableCell colSpan={10}>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Company Name:</strong> {user.companyName}</p>
//                         <p><strong>Email:</strong> {user.email}</p>
//                         <p><strong>Password:</strong> {user.password}</p>
//                         <p><strong>User Type:</strong> {user.userType}</p>
//                         <p><strong>Created At:</strong> {user.createdAt}</p>
//                         <div className="flex items-center gap-2">
//                           <strong>Active:</strong>
//                           <Switch
//                             checked={user.active}
//                             onCheckedChange={() => handleToggleActive(user.id)}
//                           />
//                         </div>
//                         <div className="flex gap-2 mt-2">
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => {
//                               setEditUser(user);
//                               setEditOpen(true);
//                             }}
//                           >
//                             <Edit className="w-4 h-4 text-blue-600" />
//                           </Button>
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => {
//                               setUserToDelete(user);
//                               setDeleteDialogOpen(true);
//                             }}
//                           >
//                             <Trash className="w-4 h-4 text-red-600" />
//                           </Button>
//                         </div>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Edit User Dialog */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//           </DialogHeader>

//           {editUser && (
//             <div className="flex flex-col gap-3 mb-3">
//               <div>
//                 <label className="block mb-1 font-medium">Name</label>
//                 <Input
//                   value={editUser.name}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, name: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Email</label>
//                 <Input
//                   type="email"
//                   value={editUser.email}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, email: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Password</label>
//                 <Input
//                   type="password"
//                   value={editUser.password}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, password: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setEditOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleEditUser}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>
//           <p>
//             Are you sure you want to delete user{" "}
//             <strong>{userToDelete?.email}</strong>?
//           </p>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteUser}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
