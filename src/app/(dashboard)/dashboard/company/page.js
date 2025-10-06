"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyTable from "@/components/atoms/tables/CompanyTable";


export default function BasicTables() {
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) router.replace("/login");
  }, [router]);

  

  return (
    <div>
      <PageBreadcrumb 
        title="Manage Company" 
        showBackButton
        onBack={() => router.back()} 
      />
      <div className="space-y-6">
        <ComponentCard title="Application data">
         <CompanyTable />
         {/* <DataTable
      apiUrl="${baseURL}/companies"
      schema={companySchema}
      initialForm={{
        companyName: "",
        domain: "",
        logoUrl: "",
        themeColor: "#ffffff",
        username: "",
        password: "",
      }}
      columns={[
        { key: "id", label: "ID" },
        { key: "companyName", label: "Company Name" },
        { key: "domain", label: "Domain" },
        { key: "logoUrl", label: "Logo URL" },
        {
          key: "themeColor",
          label: "Theme",
          render: (val) => <Badge style={{ background: val }}>{val}</Badge>,
        },
        { key: "username", label: "Username" },
        { key: "password", label: "Password" },
      ]}
    /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
