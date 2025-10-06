// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip as RTooltip, Bar } from "recharts";

// export default function ApprovalTab({ applicant, eligibility, approvalProbability }) {



//     const handleApprove = () => {
//     toast.success("Application approved successfully ");
//   };

//   const handleReject = () => {
//     toast.error("Application rejected");
//   };

// //   const handleExport = () => {
// //     toast.success("Your PDF has been exported successfully.");
// //   };

//   const handleHold = () => {
//     toast.warning("Application On Hold");
//   };

//   return (
//     <div className="grid gap-4 lg:grid-cols-3">
//       {/* Eligibility vs Applied */}
//       <Card className="lg:col-span-2">
//         <CardHeader>
//           <CardTitle>Eligibility vs Applied</CardTitle>
//         </CardHeader>
//         <CardContent className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={[
//                 {
//                   name: "Amount",
//                   Applied: applicant.amountApplied,
//                   Eligible: eligibility,
//                 },
//               ]}
//             >
//               <XAxis dataKey="name" />
//               <YAxis />
//               <RTooltip />
//               <Bar dataKey="Applied" fill="#3b82f6" />
//               <Bar dataKey="Eligible" fill="#10b981" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Decision */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Decision</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="text-sm">Approval Probability</div>
//           <div className="text-3xl font-semibold">{approvalProbability}%</div>
//           <Progress value={approvalProbability} />

//           <Textarea placeholder="Reviewer notes..." className="min-h-[120px]" />

//           <div className="flex gap-2">
//             <Button className="flex-1" variant="secondary" onClick={handleHold}>
//               On Hold
//             </Button>
//             <Button className="flex-1" onClick={handleApprove}>
//               Approve
//             </Button>
//             <Button className="flex-1" variant="destructive" onClick={handleReject}>
//               Reject
//             </Button>
//           </div>

//           <div className="text-xs text-muted-foreground">
//             Actions will trigger workflow events (notify applicant, disbursal, etc.).
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


//*****************************dsdd */

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Bar,
} from "recharts";

export default function ApprovalTab({
  applicant,
  eligibility,
  approvalProbability,
  setWorkflowComplete,
  setActiveTab, 
}) {
  const handleApprove = () => {
    toast.success("Application approved successfully");
    setActiveTab("final"); 
    setWorkflowComplete(true)
  };

  const handleReject = () => {
    toast.error("Application rejected");
    setActiveTab("final"); 
  };

  const handleHold = () => {
    toast.warning("Application On Hold");
    setActiveTab("docs"); 
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Eligibility vs Applied */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Eligibility vs Applied</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: "Amount",
                  Applied: applicant.amountApplied,
                  Eligible: eligibility,
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="Applied" fill="#3b82f6" />
              <Bar dataKey="Eligible" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">Approval Probability</div>
          <div className="text-3xl font-semibold">{approvalProbability}%</div>
          <Progress value={approvalProbability} />

          <Textarea placeholder="Reviewer notes..." className="min-h-[120px]" />

          <div className="flex gap-2">
            <Button className="flex-1" variant="secondary" onClick={handleHold}>
              On Hold
            </Button>
            <Button className="flex-1" onClick={handleApprove}>
              Approve
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Actions will trigger workflow events (notify applicant, disbursal,
            etc.).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
