"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

export default function UserInfoCard({ doc, type }) {
  if (!doc) {
    return (
      <Card className="p-5 lg:p-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {type}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No document details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-5 lg:p-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {type}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {Object.entries(doc).map(([key, value]) => (
            <div key={key}>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                {key}
              </p>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                {value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
