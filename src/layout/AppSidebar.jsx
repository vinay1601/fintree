"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutDashboard,
  AppWindow,
  ClipboardList,
  MapPin,
  ChevronDown,
} from "lucide-react";

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Fetch role from session storage or context
    const userRole = sessionStorage.getItem("role"); // "superadmin" or "companyUser"
    setRole(userRole);
  }, []);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: `/dashboard`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      name: "Manage Company",
      path: `/dashboard/company`,
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      name: "Pages",
      path: `/dashboard/pages`,
    },
    {
      icon: <AppWindow className="w-5 h-5" />,
      name: "Department & Roles",
      subItems: [
        { name: "Department", path: `/dashboard/department&role/department` },
        { name: "Roles", path: `/dashboard/department&role/roles` },
        { name: "Users", path: `/dashboard/department&role/users` },
      ],
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      name: "Products",
      path: `/dashboard/product`,
    },
  ];

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (role === "SuperAdmin") return true; // superadmin sees all
    if (role === "CompanyUser") {
      // companyUser sees only Dashboard + Department & Roles
      return item.name === "Dashboard" || item.name === "Department & Roles" || item.name === "Products";
    }
    return false; // No role? Show nothing
  });

  useEffect(() => {
    if (!isExpanded && !isHovered && !isMobileOpen) {
      setOpenSubmenu(null);
    }
  }, [isExpanded, isHovered, isMobileOpen]);

  const getMenuItemClass = () =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full 
     text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={getMenuItemClass()}
            >
              <div className="flex items-center gap-3 flex-1">
                {nav.icon}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-left">{nav.name}</span>
                )}
              </div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSubmenu === index ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            <Link href={nav.path} className={getMenuItemClass()}>
              {nav.icon}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="flex-1 text-left">{nav.name}</span>
              )}
            </Link>
          )}

          {nav.subItems && openSubmenu === index && (
            <ul className="ml-6 mt-1 flex flex-col gap-1">
              {nav.subItems.map((sub) => (
                <li key={sub.name}>
                  <Link href={sub.path} className={getMenuItemClass()}>
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  // If role is not loaded yet, show nothing
  if (!role) return null;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
        border-r border-gray-200 dark:border-gray-800
        h-screen transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <Image
              src="/assets/images/fintree/logo.png"
              alt="Logo"
              width={150}
              height={40}
            />
          ) : (
            <Image
              src="/assets/images/fintree/logo.png"
              alt="Logo Icon"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {renderMenuItems(filteredNavItems)}
      </nav>
    </aside>
  );
};

export default AppSidebar;

//***************************************working code******************************************* */
// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import { rolePermissions } from "@/utils/access/rolePermissions";
// import {
//   LayoutDashboard,
//   AppWindow,
//   ClipboardList,
//   ShieldCheck,
//   MapPin,
//   CreditCard,
//   FileSearch,
//   ChevronDown,
//   MoreHorizontal,
//   ClipboardCheck,
// } from "lucide-react";

// const navItems = [
//   { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard" },
//   { icon: <AppWindow className="w-5 h-5" />, name: "Department", path: "/dashboard/department&role/roles"  },
//   { icon: <AppWindow className="w-5 h-5" />, name: "Applications", path: "/dashboard/applicationid" },
//   { icon: <ClipboardList className="w-5 h-5" />, name: "Questionnaire", path: "/dashboard/q&a" },
//   // { icon: <ShieldCheck className="w-5 h-5" />, name: "Risk Assessment", path: "/dashboard/riskassessment" },
//   { icon: <MapPin className="w-5 h-5" />, name: "FI", path: "/dashboard/field_investigation" },
//    { icon: <MapPin className="w-5 h-5" />, name: "Integration", path: "/dashboard/whatsapp" },
//   { icon: <CreditCard className="w-5 h-5" />, name: "Credit", path: "/dashboard/credit" },
//     { icon: <ClipboardCheck className="w-5 h-5" />, name: "PDI", path: "/dashboard/pdi" },
//   { icon: <FileSearch className="w-5 h-5" />, name: "Audit Log", path: "/dashboard/audit" },

// ];

// const AppSidebar = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();

//   const [openSubmenu, setOpenSubmenu] = useState(null);
//   const [subMenuHeight, setSubMenuHeight] = useState({});
//   const subMenuRefs = useRef({});
//   const [role, setRole] = useState(null);

//   const isActive = useCallback((path) => path === pathname, [pathname]);

//   const handleSubmenuToggle = (index, menuType) => {
//     setOpenSubmenu((prev) =>
//       prev && prev.type === menuType && prev.index === index
//         ? null
//         : { type: menuType, index }
//     );
//   };

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//   }, []);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({
//           ...prev,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   // ✅ Permission check
//   const hasAccess = (path) => {
//     if (!role) return false;
//     const allowed = rolePermissions[role] || [];
//     return allowed.includes("*") || allowed.includes(path);
//   };

//   // ✅ Filter menu based on role
//   const filteredNavItems = navItems.filter(
//     (item) => !item.path || hasAccess(item.path)
//   );

//   // Menu item classes with dark mode
//   const getMenuItemClass = (active) =>
//     `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
//      ${active
//        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`;

//   const renderMenuItems = (items, menuType) => (
//     <ul className="flex flex-col gap-2">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.path && (
//             <Link
//               href={nav.path}
//               className={getMenuItemClass(isActive(nav.path))}
//             >
//               <span>{nav.icon}</span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//             </Link>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0
//         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
//         border-r border-gray-200 dark:border-gray-800
//         h-screen transition-all duration-300 ease-in-out z-50
//         ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Logo */}
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 src="/assets/images/logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//                 className="dark:hidden"
//               />
//               <Image
//                 src="/assets/images/logo.png"
//                 alt="Logo Dark"
//                 width={150}
//                 height={40}
//                 className="hidden dark:block"
//               />
//             </>
//           ) : (
//             <Image
//               src="/assets/images/logo-icon.png"
//               alt="Logo Icon"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>

//       {/* Menu */}
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px]
//                   text-gray-400 dark:text-gray-500
//                   ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? "Menu" : <MoreHorizontal />}
//               </h2>
//               {renderMenuItems(filteredNavItems, "main")}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;

//*********************************sidebar chage 8-9-25 1.05********************************** */

// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   Grid,
//   Calendar,
//   UserCircle,
//   List,
//   Table,
//   FileText,
//   ChevronDown,
//   MoreHorizontal,
//   PieChart,
//   Box,
//   Plug,
//   LayoutDashboard,
//   AppWindow,
//   ClipboardList,
//   ShieldCheck,
//   MapPin,
//   CreditCard,
//   FileSearch,
// } from "lucide-react";

// const navItems = [
//   {
//     icon: <LayoutDashboard className="w-5 h-5" />,
//     name: "Dashboard",
//     // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
//     path: "/dashboard",
//   },
//   {
//     icon: <AppWindow className="w-5 h-5" />,
//     name: "Applications",
//     path: "/dashboard/applicationid",
//   },
//   {
//     icon: <ClipboardList className="w-5 h-5" />,
//     name: "Questionnaire",
//     path: "/dashboard/q&a",
//   },
//   {
//     icon: <ShieldCheck className="w-5 h-5" />,
//     name: "Risk Assessment",
//     path: "/dashboard/riskassessment",
//   },
//   {
//     icon: <MapPin className="w-5 h-5" />,
//     name: "FI",
//     path: "/dashboard/field_investigation",
//   },
//   {
//     icon: <CreditCard className="w-5 h-5" />,
//     name: "Credit",
//     path: "/dashboard/credit",
//   },
//   {
//     icon: <FileSearch className="w-5 h-5" />,
//     name: "Audit Log",
//     path: "/dashboard/audit",
//   },
//   // {
//   //   name: "Forms",
//   //   icon: <List className="w-5 h-5" />,
//   //   subItems: [{ name: "Form Elements", path: "/dashboard/test", pro: false }],
//   //   subItems: [{ name: "FI", path: "/dashboard/field_investigation", pro: false }],
//   //   subItems: [{ name: "Credit", path: "/dashboard/credit", pro: false }],
//   // },
//   // {
//   //   name: "Tables",
//   //   icon: <Table className="w-5 h-5" />,
//   //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//   // },
//   // {
//   //   name: "Pages",
//   //   icon: <FileText className="w-5 h-5" />,
//   //   subItems: [
//   //     { name: "Blank Page", path: "/blank", pro: false },
//   //     { name: "404 Error", path: "/error-404", pro: false },
//   //   ],
//   // },
// ];

// // const othersItems = [
// //   {
// //     icon: <PieChart className="w-5 h-5" />,
// //     name: "Charts",
// //     subItems: [
// //       { name: "Line Chart", path: "/line-chart", pro: false },
// //       { name: "Bar Chart", path: "/bar-chart", pro: false },
// //     ],
// //   },
// //   {
// //     icon: <Box className="w-5 h-5" />,
// //     name: "UI Elements",
// //     subItems: [
// //       { name: "Alerts", path: "/alerts", pro: false },
// //       { name: "Avatar", path: "/avatars", pro: false },
// //       { name: "Badge", path: "/badge", pro: false },
// //       { name: "Buttons", path: "/buttons", pro: false },
// //       { name: "Images", path: "/images", pro: false },
// //       { name: "Videos", path: "/videos", pro: false },
// //     ],
// //   },
// //   {
// //     icon: <Plug className="w-5 h-5" />,
// //     name: "Authentication",
// //     subItems: [
// //       { name: "Sign In", path: "/signin", pro: false },
// //       { name: "Sign Up", path: "/signup", pro: false },
// //     ],
// //   },
// // ];

// const AppSidebar = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();

//   const [openSubmenu, setOpenSubmenu] = useState(null);
//   const [subMenuHeight, setSubMenuHeight] = useState({});
//   const subMenuRefs = useRef({});

//   const isActive = useCallback((path) => path === pathname, [pathname]);

//   const handleSubmenuToggle = (index, menuType) => {
//     setOpenSubmenu((prev) => {
//       if (prev && prev.type === menuType && prev.index === index) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };

//   // useEffect(() => {
//   //   let submenuMatched = false;
//   //   ["main", "others"].forEach((menuType) => {
//   //     const items = menuType === "main" ? navItems : othersItems;
//   //     items.forEach((nav, index) => {
//   //       if (nav.subItems) {
//   //         nav.subItems.forEach((subItem) => {
//   //           if (isActive(subItem.path)) {
//   //             setOpenSubmenu({ type: menuType, index });
//   //             submenuMatched = true;
//   //           }
//   //         });
//   //       }
//   //     });
//   //   });

//   //   if (!submenuMatched) setOpenSubmenu(null);
//   // }, [pathname, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({
//           ...prev,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const renderMenuItems = (items, menuType) => (
//     <ul className="flex flex-col gap-2">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors group
//               ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               }
//               cursor-pointer ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDown
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
//                 ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}

//           {/* Submenu */}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
//                       ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 className="dark:hidden"
//                 src="/assets/images/logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <Image
//                 className="hidden dark:block"
//                 src="/assets/images/logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <Image
//               src="/assets/images/logo.png"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <MoreHorizontal />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             {/* <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <MoreHorizontal />
//                 )}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div> */}
//           </div>
//         </nav>
//         {/* {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />} */}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
