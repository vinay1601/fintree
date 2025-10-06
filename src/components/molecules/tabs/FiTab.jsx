"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  User,
  ClipboardList,
  FileText,
  MapPin,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const FiTab = ({ fiData }) => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [loadingDoc, setLoadingDoc] = useState(true);

  useEffect(() => {
    if (fiData) {
      const questionDocs = (fiData.questionsAndAnswers || [])
        .map((qa) =>
          qa.uploadedDocument
            ? { name: qa.uploadedDocument, status: "attached" }
            : null
        )
        .filter(Boolean);

      const fiDocs = (fiData.documents || []).map((doc) => ({
        name: doc.name,
        status: doc.status,
      }));

      setAllDocuments([...fiDocs, ...questionDocs]);
    }
  }, [fiData]);

  if (!fiData) {
    return <div className="p-4 text-muted-foreground">Loading FI Data...</div>;
  }

  const {
    applicationId,
    name,
    loanType,
    fiDate,
    investigationEmployee = {},
    location = {},
    questionsAndAnswers = [],
  } = fiData || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Application Info */}
      <Card className="shadow-md">
        <CardHeader className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <CardTitle>Application Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Application ID:</strong> {applicationId}</p>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Loan Type:</strong> {loanType}</p>
          <p><strong>FI Date:</strong> {fiDate}</p>
        </CardContent>
      </Card>

      {/* Investigation Employee */}
      {investigationEmployee?.id && (
        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>Investigation Employee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>ID:</strong> {investigationEmployee.id}</p>
            <p><strong>Name:</strong> {investigationEmployee.name}</p>
          </CardContent>
        </Card>
      )}

      {/* Location */}
      {(location?.latitude || location?.longitude) && (
        <Card className="shadow-md md:col-span-2">
          <CardHeader className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 border rounded-md">
              <p className="font-semibold text-muted-foreground">Latitude</p>
              <p>{location.latitude}</p>
            </div>
            <div className="p-3 border rounded-md">
              <p className="font-semibold text-muted-foreground">Longitude</p>
              <p>{location.longitude}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Card */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {allDocuments.map((doc, idx) => (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <button className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/20 transition w-full">
                  <span>{doc.name}</span>
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{doc.name}</DialogTitle>
                </DialogHeader>
                {loadingDoc && (
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-6 w-full rounded" />
                    <Skeleton className="h-6 w-full rounded" />
                    <Skeleton className="h-6 w-full rounded" />
                  </div>
                )}
                {!loadingDoc && (
                  <div className="mt-2">
                    <p>📄 Document Status: {doc.status}</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </CardContent>
      </Card>

      {/* FI Questions */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <CardTitle>FI Questions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionsAndAnswers.map((qa) => (
            <div
              key={qa.id}
              className="py-3 px-6 border rounded-md text-sm hover:bg-muted/30 transition"
            >
              <p className="font-semibold">{qa.question}</p>
              <p><strong>Answer:</strong> {qa.answer}</p>
              
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FiTab;
