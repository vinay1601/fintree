"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Home, Landmark, FileText, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const LoginTab = ({ loginData }) => {
  const [allDocuments, setAllDocuments] = useState([]);

  useEffect(() => {
    if (loginData?.documentsInfo) {
      const docsArray = Object.entries(loginData.documentsInfo).map(([key, value]) => ({
        title: key.replace("_", " ").toUpperCase(),
        ...value,
      }));
      setAllDocuments(docsArray);
    }
  }, [loginData]);

  if (!loginData) return <div>No Login Data Found</div>;

  const { personalDetails, addressInformation, bankDetails } = loginData;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

      {/* Personal Details */}
      <Card className="shadow-md">
        <CardHeader className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Name:</strong> {personalDetails.fullName}</p>
          <p><strong>Mobile:</strong> {personalDetails.mobileNumber}</p>
          <p><strong>Email:</strong> {personalDetails.emailAddress}</p>
        </CardContent>
      </Card>

      {/* Address Info */}
<Card className="shadow-md">
  <CardHeader className="flex items-center gap-2">
    <Home className="w-5 h-5 text-primary" />
    <CardTitle>Address Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2 text-sm">
    <p><strong>Current:</strong> {addressInformation.currentAddress}</p>
    <p><strong>Permanent:</strong> {addressInformation.permanentAddress}</p>
    <div className="flex items-center gap-3 mt-2">
      {addressInformation.liveSelfie ? (
        <img
          src={addressInformation.liveSelfie}
          alt="Live Selfie"
          className="w-16 h-16 rounded-full border object-cover"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center rounded-full border bg-muted">
          <User className="w-8 h-8 text-primary" />
        </div>
      )}
      <span className="text-muted-foreground">Live Selfie</span>
    </div>
  </CardContent>
</Card>


      {/* Bank Details */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" />
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <h4 className="font-semibold">Personal Account</h4>
            <p><strong>Bank:</strong> {bankDetails.personal.bankName}</p>
            <p><strong>IFSC:</strong> {bankDetails.personal.ifscCode}</p>
            <p><strong>Acc No:</strong> {bankDetails.personal.accountNumber}</p>
            <p><strong>Holder:</strong> {bankDetails.personal.accountHolderName}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold">Company Account</h4>
            <p><strong>Bank:</strong> {bankDetails.company.bankName}</p>
            <p><strong>IFSC:</strong> {bankDetails.company.ifscCode}</p>
            <p><strong>Acc No:</strong> {bankDetails.company.accountNumber}</p>
            <p><strong>Holder:</strong> {bankDetails.company.accountHolderName}</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {allDocuments.map((doc, idx) => (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <button className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/20 transition w-full">
                  <span>{doc.title}</span>
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{doc.title}</DialogTitle>
                </DialogHeader>

                {/* Skeleton Loader */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginTab;
