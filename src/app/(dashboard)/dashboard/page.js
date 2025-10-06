"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AreaChart from "@/components/atoms/chart/AreaChart";
import RadarChart from "@/components/atoms/chart/RadialChart";
import UserBarChart from "@/components/atoms/chart/UserBarChart";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/atoms/StatCard";
import DataTable from "@/components/atoms/tables/DataTable";

const cardData = [
  {
    title: "Total Revenue",
    price: "₹1,250.00",
    percentage: 12.5,
    line1: "Trending up this month",
    line2: "Visitors for the last 6 months",
  },
  {
    title: "Customer Churn",
    price: "₹320",
    percentage: -5.2,
    line1: "Churn decreased this quarter",
    line2: "Compared to previous quarter",
  },
  {
    title: "New Signups",
    price: "₹980",
    percentage: 8.3,
    line1: "Signups are growing",
    line2: "Last 30 days",
  },
];

const Dashboard = () => {
    const router = useRouter();
  useEffect(() => {
    const user = sessionStorage.getItem("userId");
    if (!user) router.replace("/login");
  }, [router]);
  return (
    <div className="flex h-full w-full bg-neutral-light text-neutral-dark">
      <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 h-full w-full gap-4">
        <div className="flex flex-col w-full h-full gap-4 col-span-4 md:col-span-4 xl:col-span-4">
        


          {/* Welcome Card */}
          <div className="flex flex-col w-full h-fit border border-neutral-gray/30 bg-white dark:bg-[#1F2937] p-6 gap-3 rounded-xl shadow-md">
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary">
              Welcome 👋
            </span>
            <p className="text-sm md:text-base text-neutral-gray">
              Welcome back to Fintree LOS — your command center for smarter lending decisions. Track, manage, and accelerate your loan journey with ease.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:w-full">
            {cardData.map((item, index) => (
              <StatCard
                key={index}
                title={item.title}
                price={item.price}
                percentage={item.percentage}
                line1={item.line1}
                line2={item.line2}
              />
            ))}
          </div>

          {/* Area Chart */}
          <div className="flex md:hidden flex-col w-full h-fit border border-neutral-gray/30 bg-white dark:bg-[#1F2937] p-4 gap-2 rounded-lg">
            <span className="text-sm font-medium text-primary">
              Today’s Tasks
            </span>
            <AreaChart />
          </div>
          <div className="hidden md:flex flex-col w-full h-fit bg-white dark:bg-[#1F2937] rounded-lg shadow-md p-4">
            <AreaChart />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 h-fit w-full">
            <div className="flex flex-col w-full border border-neutral-gray/30 bg-white dark:bg-[#1F2937] p-4 gap-2 rounded-lg shadow-sm md:col-span-2 lg:col-span-1 xl:col-span-1">
              <span className="text-base font-bold text-secondary">
                Visitors Data
              </span>
              <RadarChart />
            </div>
            <div className="flex flex-col w-full border border-neutral-gray/30 bg-white dark:bg-[#1F2937] p-4 gap-2 rounded-lg shadow-sm md:col-span-2 lg:col-span-1 xl:col-span-1">
              <span className="text-base font-bold text-secondary">
                Monthly Data
              </span>
              <UserBarChart />
            </div>
          </div>

          {/* Data Table */}
          <div className="flex flex-col w-full h-full border border-neutral-gray/30 bg-white dark:bg-[#1F2937] p-4 gap-2 rounded-lg shadow-md">
            <span className="text-sm font-semibold text-primary">
              Today’s Tasks
            </span>
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
