"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserTable from "@/components/atoms/tables/UserTE";

export default function BasicTables() {
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) router.replace("/login");
  }, [router]);

  return (
    <div>
      <PageBreadcrumb 
        title="Manage Users" 
        showBackButton
        onBack={() => router.back()} 
      />
      <div className="space-y-6">
        <ComponentCard title="Application data">
            <UserTable />
        </ComponentCard>
      </div>
    </div>
  );
}
