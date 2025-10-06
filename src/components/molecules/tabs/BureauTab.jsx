"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, CircleDashed, AlertTriangle } from "lucide-react";

export default function BureauTab({ applicant }) {
  const { bureau } = applicant;
  const [open, setOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);

  const currency = (val) =>
    val
      ? val.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        })
      : "—";

  // Transform EMI history into { year: { month: status } } format
 const groupByYear = (emiHistory = []) => {
  const years = ["2021", "2022", "2023", "2024", "2025"]; // define all years you want to show
  const grouped = {};

  // Initialize all years
  years.forEach((year) => {
    grouped[year] = {};
  });

  // Populate EMI data
  emiHistory.forEach((r) => {
    const [year, month] = r.month.split("-");
    if (!grouped[year]) grouped[year] = {};
    grouped[year][month] = r.paidOnTime
      ? "paid"
      : r.delayDays
      ? "late"
      : "disputed";
  });

  return grouped;
};

 const renderStatus = (status) => {
  switch (status) {
    case "paid":
      return <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />;
    case "late":
      return <XCircle className="w-4 h-4 text-red-500 mx-auto" />;
    case "disputed":
      return <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto" />;
    default:
      return <CircleDashed className="w-4 h-4 text-gray-400 mx-auto" />;
  }
};
  const handleOpen = (line) => {
    setSelectedLine(line);
    setOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trade Lines & History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bureau Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground">History Length</div>
              <div className="font-semibold">{bureau.historyYears} years</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Delinquencies</div>
              <div className="font-semibold">{bureau.delinquencies}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Inquiries (6m)</div>
              <div className="font-semibold">{bureau.inquiriesLast6m}</div>
            </div>
          </div>

          {/* Trade Lines Table */}
          <ScrollArea className="mt-4 h-56 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>DPD</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bureau.activeLines.map((line, i) => (
                  <TableRow key={i}>
                    <TableCell>{line.organization || "—"}</TableCell>
                    <TableCell
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleOpen(line)}
                    >
                      {line.type}
                    </TableCell>
                    <TableCell>{currency(line.limit)}</TableCell>
                    <TableCell>{currency(line.balance)}</TableCell>
                    <TableCell>
                      <Badge variant={line.status === "Active" ? "secondary" : "outline"}>
                        {line.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{line.dpd}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleOpen(line)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* EMI / Payment History Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="min-w-xl w-full">
    <DialogHeader>
      <DialogTitle>EMI / Payment History</DialogTitle>
    </DialogHeader>

    {selectedLine && (
      <div className="space-y-6">
        {/* Loan summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sanctioned Amount</p>
            <p className="font-semibold">{currency(selectedLine.limit)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="font-semibold">{currency(selectedLine.balance)}</p>
          </div>
        </div>

        {/* EMI / Payment History Table */}
        <ScrollArea className="h-72 rounded-md border w-fit">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                  <TableHead key={i}>{m}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupByYear(selectedLine.emiHistory || [])).map(([year, months]) => (
                <TableRow key={year}>
                  <TableCell className="font-semibold">{year}</TableCell>
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
                    <TableCell key={m} className="text-center">
                      {renderStatus(months[m])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Legend */}
        <div className="flex gap-6 text-sm items-center">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> On time
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-500" /> Late
          </span>
          <span className="flex items-center gap-1">
            <CircleDashed className="w-4 h-4 text-gray-400" /> Not reported
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Disputed
          </span>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
    </>
  );
}
