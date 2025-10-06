"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function AlertDialog({
  open,
  onOpenChange,
  title = "Alert",
  description = "",
  type = "success",
}) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
      case "info":
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center space-y-4 max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center mt-8 justify-center gap-2">
            {getIcon()}
            <span
              className={`text-3xl font-semibold ${
                type === "success"
                  ? "text-green-600"
                  : type === "error"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {title}
            </span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
        <DialogFooter className="justify-center">
          <Button onClick={() => onOpenChange(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
