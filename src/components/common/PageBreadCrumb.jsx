import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PageBreadcrumb = ({ title, subtitle, showBackButton, onBack }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="rounded-md shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Section: Breadcrumb Navigation */}
      <nav className="w-full md:w-auto">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          <li>
            <div>
              <Link
                className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                href="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </li>
          <li className="text-gray-800 dark:text-white/90">{title}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;

//**********************************without set the breakpoint************************************* */
// import Link from "next/link";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";

// const PageBreadcrumb = ({ title, subtitle, showBackButton, onBack }) => {
//   return (
//     <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
     
//       <div className="mb-1">
//         <div className="flex items-center gap-2">
//           {showBackButton && (
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={onBack}
//               className="rounded-md" 
              

//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           )}

//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {title}
//           </h1>
//         </div>
//         {subtitle && (
//           <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
//         )}
//       </div>
//       <nav>
//         <ol className="flex items-center gap-1.5">
//           <li>
//             <div>
//               <Link
//                 className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
//                 href="/"
//               >
//                 Home
//                 <svg
//                   className="stroke-current"
//                   width="17"
//                   height="16"
//                   viewBox="0 0 17 16"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
//                     stroke="currentColor"
//                     strokeWidth="1.2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </Link>
//             </div>
//           </li>
//           <li className="text-sm text-gray-800 dark:text-white/90">{title}</li>
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default PageBreadcrumb;
