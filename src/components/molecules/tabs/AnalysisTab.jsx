import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { CreditCard, Building2 } from "lucide-react";

const currency = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function AnalysisTab({ applicant, dti, eligibility }) {
  const incomeVsObligations = [
    { name: "Income", value: applicant.incomeMonthly },
    { name: "Obligations", value: applicant.fixedObligationsMonthly },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Left: DTI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Debt-to-Income (DTI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomeVsObligations} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                    {incomeVsObligations.map((_, idx) => <Cell key={idx} />)}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm">
              <div>Monthly Income: <span className="font-medium">{currency(applicant.incomeMonthly)}</span></div>
              <div>Monthly Obligations: <span className="font-medium">{currency(applicant.fixedObligationsMonthly)}</span></div>
              <div>DTI Ratio: <Badge variant={dti < 45 ? "secondary" : "destructive"}>{dti}%</Badge></div>
              <div>Tenure: <span className="font-medium">{applicant.tenureMonths} months</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Employment */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Employment & Obligations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Employment</div>
            <div className="text-base font-medium">{applicant.employment.type}</div>
            <div className="text-sm">Company: <span className="font-medium">{applicant.employment.company}</span></div>
            <div className="text-sm">Experience: <span className="font-medium">{applicant.employment.experienceYears} years</span></div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Loan Eligibility (est.)</div>
            <div className="text-2xl font-semibold">{currency(eligibility)}</div>
            <div className="text-xs text-muted-foreground">Calculated from affordable EMI and tenure</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
