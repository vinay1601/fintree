"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
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

const PdiTab = ({ pdiData }) => {

    console.log("sdfsf",pdiData)
  const [allDocuments, setAllDocuments] = useState([]);
  const [loadingDoc, setLoadingDoc] = useState(true);

  useEffect(() => {
    if (pdiData) {
      const questionDocs = (pdiData.questions || [])
        .map((q) =>
          q.uploadedDocument
            ? { name: q.uploadedDocument, status: "attached" }
            : null
        )
        .filter(Boolean);

      setAllDocuments([...questionDocs]);
    }
  }, [pdiData]);

  if (!pdiData) {
    return <div className="p-4 text-muted-foreground">Loading PDI Data...</div>;
  }

  const { applicationId, name, userType, email, phone, address, questions = [] } = pdiData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PDI Basic Info */}
   <Card className="shadow-md md:col-span-2">
  <CardHeader className="flex items-center gap-2">
    <ClipboardList className="w-5 h-5 text-primary" />
    <CardTitle>PDI Info</CardTitle>
  </CardHeader>
  <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
    <div>
      <p className="font-semibold text-muted-foreground">Application ID</p>
      <p>{applicationId}</p>
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">Name</p>
      <p>{name}</p>
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">User Type</p>
      <p>{userType}</p>
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">Email</p>
      <p>{email}</p>
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">Phone</p>
      <p>{phone}</p>
    </div>
    <div>
      <p className="font-semibold text-muted-foreground">Address</p>
      <p>{address}</p>
    </div>
  </CardContent>
</Card>


      {/* All Documents */}
      {allDocuments.length > 0 && (
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

                  {/* Skeleton Loader */}
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

                  <img
                    src="/dummy.pdf"
                    alt={doc.name}
                    className="hidden"
                    onLoad={() => setLoadingDoc(false)}
                  />
                </DialogContent>
              </Dialog>
            ))}
          </CardContent>
        </Card>
      )}

      {/* PDI Questions */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <CardTitle>PDI Questions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <div
              key={q.qid}
              className="py-3 px-6 border rounded-md text-sm hover:bg-muted/30 transition"
            >
              <p className="font-semibold">{q.question}</p>
              <p><strong>Answer:</strong> {q.answer}</p>
             
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PdiTab;
