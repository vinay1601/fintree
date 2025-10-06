import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

useEffect(() => {
  const storedRole = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");

  if (storedRole) setRole(storedRole);
  const interval = setInterval(() => {
    const expiration = sessionStorage.getItem("accessToken");
    if (expiration && Date.now() > Number(expiration)) {
      // Clear session and redirect
      sessionStorage.clear();
      router.push("/login");
    }
  }, 1000); // every second

  return () => clearInterval(interval);

  // if (userId) {
  //   fetch(`/api/get-user/${userId}`)
  //     .then(async (res) => {
  //       console.log("fetch status1:", res.status);
  //       if (!res.ok) {
  //         const text = await res.text();
  //         console.error("API returned non-JSON:", text);
  //         return;
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Fetched data:", data);
  //       if (data) setEmail(data.email);
  //     })
  //     .catch((err) => console.error("Failed to fetch email:", err));
  // }
}, []);





  function toggleDropdown(e) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }


const handleSignOut = () => {

 sessionStorage.removeItem("userId");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  router.push("/login");
};


  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 px-1 py-1 overflow-hidden rounded-full h-11 w-11 border-2">
          <Image width={34} height={34} src="/assets/images/fintree/user.png" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{role || "User"}</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {role || "User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {email || "userdemo@gmail.com"}
          </span>
        </div>

        <Button
          
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </Dropdown>
    </div>
  );
}

//*************************************08-09-25 4:25************************************************* */
// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Dropdown } from "@/components/ui/dropdown/Dropdown";
// import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
// import { LogOut } from "lucide-react"; // ✅ import icon

// export default function UserDropdown() {
//   const [isOpen, setIsOpen] = useState(false);

//   function toggleDropdown(e) {
//     e.stopPropagation();
//     setIsOpen((prev) => !prev);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   return (
//     <div className="relative">
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
//       >
//         <span className="mr-3 px-1 py-1 overflow-hidden rounded-full h-11 w-11 border-2">
//           <Image
//             width={34}
//             height={34}
//             src="/assets/images/user.png"
//             alt="User"
//           />
//         </span>

//         <span className="block mr-1 font-medium text-theme-sm">Admin</span>

//         <svg
//           className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           width="18"
//           height="20"
//           viewBox="0 0 18 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>

//       <Dropdown
//         isOpen={isOpen}
//         onClose={closeDropdown}
//         className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
//       >
//         <div>
//           <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
//             Admin
//           </span>
//           <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
//             admin123@gmail.com
//           </span>
//         </div>

//         <Link
//           href="/signin"
//           className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//         >
//           <LogOut className="h-4 w-4" /> {/* ✅ lucide icon */}
//           Sign out
//         </Link>
//       </Dropdown>
//     </div>
//   );
// }
