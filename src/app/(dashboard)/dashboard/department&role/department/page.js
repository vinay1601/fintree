// "use client";

// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import DataTE from "@/components/atoms/tables/DataTE";
// import { useSelector, useDispatch } from "react-redux";
// import { addDepartment, updateDepartment } from "@/redux/slice/departmentSlice";

// export default function BasicTables() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const departments = useSelector((state) => state.departments);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) router.replace("/login");
//   }, [router]);

//   // Define table columns
//   const columns = [
//     { key: "id", label: "ID", sortable: true },
//     { key: "name", label: "Department Name", sortable: true },
//     { key: "subDepartments", label: "Sub-departments", sortable: false, render: (item) => item.subDepartments.join(", ") },
//     { key: "description", label: "Description", sortable: false },
//     { key: "isActive", label: "Status", sortable: true, render: (item) => item.isActive ? "Active" : "Inactive" },
//   ];

//   // Add department handler
//   const handleAdd = (newDept) => {
//     const id = `dept-${departments.length + 1}`;
//     dispatch(addDepartment({ id, ...newDept }));
//   };

//   // Edit department handler
//   const handleEdit = (updatedDept) => {
//     dispatch(updateDepartment(updatedDept));
//   };

//   return (
//     <div>
//       <PageBreadcrumb 
//         title="Department" 
//         showBackButton
//         onBack={() => router.back()} 
//       />
//       <div className="space-y-6">
//         <ComponentCard title="Application data">
//           <DataTE 
//             columns={columns} 
//             data={departments} 
//             onAdd={handleAdd} 
//             onEdit={handleEdit} 
//             showAddButton={true} 
//           />
//         </ComponentCard>
//       </div>
//     </div>
//   );
// }
"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyTable from "@/components/atoms/tables/CompanyTable";
import DepartmentTable from "@/components/atoms/tables/DepartmentTE";


export default function BasicTables() {
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("accessToken");
    if (!userId) router.replace("/login");
  }, [router]);

  

  return (
    <div>
      <PageBreadcrumb 
        title="Manage Department" 
        showBackButton
        onBack={() => router.back()} 
      />
      <div className="space-y-6">
        <ComponentCard title="Application data">
         <DepartmentTable />
        </ComponentCard>
      </div>
    </div>
  );
}
