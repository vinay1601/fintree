import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, AlertTriangle, CreditCard } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import RiskCredit from "@/components/atoms/chart/RiskCredit";

export default function BankTab({ applicant }) {
  const accounts = applicant.bankAccounts ?? [];
  let bankSummary = applicant.bankSummary ?? {};

  const currency = (n) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  // Compute bank summary from accounts if available
  if (accounts.length > 0) {
    const avgBalance = Math.round(accounts.reduce((s, a) => s + (a.avgBalance ?? 0), 0) / accounts.length) || 0;
    const avgInflow = Math.round(accounts.reduce((s, a) => s + (a.avgInflow ?? 0), 0) / accounts.length) || 0;
    const avgOutflow = Math.round(accounts.reduce((s, a) => s + (a.avgOutflow ?? 0), 0) / accounts.length) || 0;
    const redFlags = accounts.flatMap((a) => a.redFlags ?? []);

    bankSummary = {
      avgBalance: bankSummary.avgBalance ?? avgBalance,
      avgInflow: bankSummary.avgInflow ?? avgInflow,
      avgOutflow: bankSummary.avgOutflow ?? avgOutflow,
      redFlags: bankSummary.redFlags ?? redFlags,
      chequesReturned: bankSummary.chequesReturned ?? 0,
      creditTurnover: bankSummary.creditTurnover ?? 0,
      debitTurnover: bankSummary.debitTurnover ?? 0,
    };
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
      {/* LEFT: CIBIL Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> CIBIL Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <RiskCredit value={applicant.cibil?.score ?? 0} />
        </CardContent>
      </Card>

      {/* RIGHT: Bank Summary + Accordion */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" /> Bank Statement Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aggregated summary */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Average Balance</div>
              <div className="font-semibold">{currency(bankSummary.avgBalance)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Inflow</div>
              <div className="font-semibold">{currency(bankSummary.avgInflow)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Outflow</div>
              <div className="font-semibold">{currency(bankSummary.avgOutflow)}</div>
            </div>
          </div>

          {/* Accordion per account */}
          {accounts.length > 0 && (
            <Accordion type="single" collapsible className="mt-2">
              {accounts.map((acc, idx) => (
                <AccordionItem key={idx} value={`acc-${idx}`} className="border rounded-lg px-2">
                  <AccordionTrigger className="flex justify-between items-center">
                    <div className="text-sm font-medium">
                      {acc.bankName} — {acc.accountType}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currency(acc.currentBalance)} · {acc.accountNumber?.slice(-4)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Account Number</div>
                        <div className="font-medium">{acc.accountNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">IFSC / Branch</div>
                        <div className="font-medium">
                          {acc.ifscCode} · {acc.branchName} ({acc.branchCode})
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Current Balance</div>
                        <div className="font-medium">{currency(acc.currentBalance)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg Balance</div>
                        <div className="font-medium">{currency(acc.avgBalance)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg Inflow</div>
                        <div className="font-medium">{currency(acc.avgInflow)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg Outflow</div>
                        <div className="font-medium">{currency(acc.avgOutflow)}</div>
                      </div>
                      <div className="sm:col-span-3">
                        <div className="text-xs text-muted-foreground mb-2">Red Flags</div>
                        {!acc.redFlags || acc.redFlags.length === 0 ? (
                          <Badge variant="secondary">None</Badge>
                        ) : (
                          <ul className="list-disc list-inside text-sm">
                            {acc.redFlags.map((f, i) => (
                              <li key={i} className="text-destructive">{f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Fallback red flags when no accounts */}
          {accounts.length === 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Red Flags</div>
              {bankSummary.redFlags?.length ? (
                <ul className="list-disc list-inside text-sm">
                  {bankSummary.redFlags.map((f, i) => (
                    <li key={i} className="text-destructive">{f}</li>
                  ))}
                </ul>
              ) : (
                <Badge variant="secondary">None</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
