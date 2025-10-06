// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Save , RotateCcw } from "lucide-react";
// import { toast } from "sonner"; // ✅ shadcn toast system

// const initialPermissions = [
//   { id: 1, page: "Dashboard", create: true, read: true, update: false, delete: false },
//   { id: 2, page: "Users", create: false, read: true, update: true, delete: false },
//   { id: 3, page: "Roles", create: true, read: true, update: true, delete: true },
//   { id: 4, page: "Reports", create: false, read: true, update: false, delete: false },
// ];

// export default function RolePermission() {
//   const [permissions, setPermissions] = useState(initialPermissions);

//   const togglePermission = (id, key) => {
//     setPermissions((prev) =>
//       prev.map((item) => {
//         if (item.id !== id) return item;
//         let updated = { ...item };

//         if (key === "create") {
//           const newValue = !item.create;
//           updated = {
//             ...item,
//             create: newValue,
//             read: newValue,
//             update: newValue,
//             delete: newValue,
//           };
//         } else if (key === "update") {
//           const newValue = !item.update;
//           updated.update = newValue;
//           if (newValue) {
//             updated.delete = true;
//           }
//         } else {
//           updated[key] = !item[key];
//         }
//         return updated;
//       })
//     );
//   };

//   const handleSave = () => {
//     toast.success(" Permissions Saved Successfully!");
//   };

//    const handleReset = () => {
//     setPermissions(initialPermissions);
//     toast.info("Permissions Reset to Default!");
//   };


//   return (
//     <div className="p-6 w-full">
//       <Card className="p-1 !shadow-none !border-none w-full">
//         {/* Header */}

//         {/* Table */}
//         <div className="overflow-x-auto w-full">
//           <Table className="w-full text-sm">
//             <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
//               <TableRow>
//                 <TableHead className="w-16 text-center font-semibold text-gray-700 dark:text-gray-200">
//                   #
//                 </TableHead>
//                 <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
//                   Page Name
//                 </TableHead>
//                 <TableHead className="text-center font-semibold">Create</TableHead>
//                 <TableHead className="text-center font-semibold">Read</TableHead>
//                 <TableHead className="text-center font-semibold">Update</TableHead>
//                 <TableHead className="text-center font-semibold">Delete</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {permissions.map((item, index) => (
//                 <TableRow
//                   key={item.id}
//                   className={`transition-colors ${
//                     index % 2 === 0
//                       ? "bg-white dark:bg-gray-900"
//                       : "bg-gray-50 dark:bg-gray-800"
//                   } hover:bg-gray-100 dark:hover:bg-gray-700`}
//                 >
//                   <TableCell className="text-center font-medium text-gray-700 dark:text-gray-200">
//                     {index + 1}
//                   </TableCell>
//                   <TableCell className="font-medium text-gray-800 dark:text-gray-100">
//                     {item.page}
//                   </TableCell>
//                   {["create", "read", "update", "delete"].map((perm) => (
//                     <TableCell key={perm} className="text-center">
//                       <Switch
//                         checked={item[perm]}
//                         onCheckedChange={() => togglePermission(item.id, perm)}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//  <div className="flex justify-start gap-3 items-center mt-8">
//           <Button size="lg" className="px-6 flex items-center gap-2" onClick={handleSave}>
//             <Save className="w-5 h-5" />
//             Save Changes
//           </Button>
//           <Button size="lg" className="px-6 flex items-center gap-2" onClick={handleReset}>
//             <RotateCcw className="w-5 h-5" />
//             Reset
//           </Button>
//         </div>

//         </div>
//       </Card>
//     </div>
//   );
// }
