"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, CircleDashed, AlertTriangle } from "lucide-react";

const currency = (val) =>
  typeof val === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val)
    : val || "—";

// --- Group EMI history by year/month ---
const groupByYear = (history = []) => {
  return history.reduce((acc, item) => {
    if (!item?.date) return acc; // skip if date missing
    const [year, month] = item.date.split("-");
    if (!acc[year]) acc[year] = {};
    acc[year][month] = item.status ?? "NR"; // fallback "Not Reported"
    return acc;
  }, {});
};

// --- Render icons based on status ---
const renderStatus = (status) => {
  switch (status) {
    case "OnTime":
    case "Y":
      return <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />;
    case "Late":
    case "N":
      return <XCircle className="w-4 h-4 text-red-500 mx-auto" />;
    case "Disputed":
      return <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto" />;
    case "NR": // Not reported
    default:
      return <CircleDashed className="w-4 h-4 text-gray-400 mx-auto" />;
  }
};

export default function TradeLineDialog({ open, setOpen, selectedLine }) {
  return (
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

            {/* EMI / Payment History */}
            <ScrollArea className="h-72 rounded-md border w-fit">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Jan</TableHead>
                    <TableHead>Feb</TableHead>
                    <TableHead>Mar</TableHead>
                    <TableHead>Apr</TableHead>
                    <TableHead>May</TableHead>
                    <TableHead>Jun</TableHead>
                    <TableHead>Jul</TableHead>
                    <TableHead>Aug</TableHead>
                    <TableHead>Sep</TableHead>
                    <TableHead>Oct</TableHead>
                    <TableHead>Nov</TableHead>
                    <TableHead>Dec</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupByYear(selectedLine.emiHistory || [])).map(
                    ([year, months]) => (
                      <TableRow key={year}>
                        <TableCell className="font-semibold">{year}</TableCell>
                        {[
                          "01",
                          "02",
                          "03",
                          "04",
                          "05",
                          "06",
                          "07",
                          "08",
                          "09",
                          "10",
                          "11",
                          "12",
                        ].map((m) => (
                          <TableCell key={m} className="text-center">
                            {renderStatus(months[m])}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  )}
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
  );
}
