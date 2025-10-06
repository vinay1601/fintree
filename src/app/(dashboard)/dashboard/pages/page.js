"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import PagesTable from "@/components/atoms/tables/PagesTE";


export default function BasicTables() {
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) router.replace("/login");
  }, [router]);

  

  return (
    <div>
      <PageBreadcrumb 
        title="Manage Pages" 
        showBackButton
        onBack={() => router.back()} 
      />
      <div className="space-y-6">
        <ComponentCard title="Application data">
            <PagesTable />
        </ComponentCard>
      </div>
    </div>
  );
}
