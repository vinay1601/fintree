"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, XCircle, Plus } from "lucide-react";

export default function DocumentsTab({
  allDocuments,
  extraDocs,
  setExtraDocs,
  newDoc,
  setNewDoc,
  completion,
}) {
  const handleAddDocument = () => {
    if (!newDoc.trim()) return;
    setExtraDocs([...extraDocs, { name: newDoc.trim(), status: "pending" }]);
    setNewDoc("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Completion</div>
          <Progress value={completion} />
        </div>

        {/* Document list */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {allDocuments.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-2xl border p-3 cursor-pointer"
              onClick={() => {
                // optional: toggle status or open detail modal
                const updatedDocs = [...extraDocs];
                if (i < extraDocs.length) {
                  updatedDocs[i].status =
                    updatedDocs[i].status === "verified" ? "pending" : "verified";
                  setExtraDocs(updatedDocs);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <div>
                  <div className="font-medium text-sm">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">KYC/Financial</div>
                </div>
              </div>
              {doc.status === "verified" ? (
                <Badge className="gap-1" variant="secondary">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </Badge>
              ) : (
                <Badge className="gap-1" variant="destructive">
                  <XCircle className="h-3 w-3" /> Pending
                </Badge>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add new document input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter document name..."
            value={newDoc}
            onChange={(e) => setNewDoc(e.target.value)}
          />
          <Button onClick={handleAddDocument}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
