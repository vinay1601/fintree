// "use client";

// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import RoleTable from "@/components/atoms/tables/RolesTE";
// import RolePermission from "@/components/molecules/RolePermission";


// export default function BasicTables() {
//   const router = useRouter();

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) router.replace("/login");
//   }, [router]);

  

//   return (
//     <div>
//       <PageBreadcrumb 
//         title="Roles Permissions" 
//         showBackButton
//         onBack={() => router.back()} 
//       />
//       <div className="space-y-6">
//         <ComponentCard title="Application data">
//          {/* <RoleTable /> */}
//          <RolePermission />
//         </ComponentCard>
//       </div>
//     </div>
//   );
// }
