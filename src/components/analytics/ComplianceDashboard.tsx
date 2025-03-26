
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  Lock,
  Globe,
  ClipboardList,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock compliance data
const complianceAreas = [
  {
    id: "data-privacy",
    name: "Data Privacy",
    icon: <Lock className="h-5 w-5" />,
    status: "compliant",
    compliance: 98,
    lastUpdated: "2025-03-20",
    details: [
      { name: "GDPR Compliance", status: "compliant", score: 100 },
      { name: "CCPA Compliance", status: "compliant", score: 95 },
      { name: "Consent Management", status: "compliant", score: 98 },
      { name: "Data Retention Policies", status: "compliant", score: 100 },
    ]
  },
  {
    id: "environmental",
    name: "Environmental Regulations",
    icon: <Globe className="h-5 w-5" />,
    status: "warning",
    compliance: 85,
    lastUpdated: "2025-03-18",
    details: [
      { name: "Carbon Footprint Reporting", status: "compliant", score: 90 },
      { name: "Waste Management", status: "warning", score: 75 },
      { name: "Supply Chain Sustainability", status: "warning", score: 80 },
      { name: "Energy Efficiency", status: "compliant", score: 95 },
    ]
  },
  {
    id: "labor",
    name: "Labor Standards",
    icon: <FileText className="h-5 w-5" />,
    status: "compliant",
    compliance: 92,
    lastUpdated: "2025-03-15",
    details: [
      { name: "Fair Labor Practices", status: "compliant", score: 100 },
      { name: "Partner Compliance", status: "compliant", score: 95 },
      { name: "Working Conditions", status: "compliant", score: 90 },
      { name: "Wage Compliance", status: "warning", score: 85 },
    ]
  },
  {
    id: "security",
    name: "Security Standards",
    icon: <ShieldCheck className="h-5 w-5" />,
    status: "warning",
    compliance: 88,
    lastUpdated: "2025-03-22",
    details: [
      { name: "Data Encryption", status: "compliant", score: 100 },
      { name: "Access Controls", status: "compliant", score: 95 },
      { name: "Vulnerability Management", status: "warning", score: 75 },
      { name: "Incident Response", status: "warning", score: 80 },
    ]
  },
];

// Compliance audit logs (mock data)
const auditLogs = [
  { 
    id: 1, 
    date: "2025-03-25", 
    action: "Data Privacy Audit", 
    result: "Passed", 
    compliance: "GDPR",
    user: "System Audit",
    notes: "Quarterly automated compliance scan passed with 98% score"
  },
  { 
    id: 2, 
    date: "2025-03-20", 
    action: "Security Controls Review", 
    result: "Action Required", 
    compliance: "ISO 27001",
    user: "John Smith",
    notes: "Vulnerability scanning needs improvement, 3 items to address"
  },
  { 
    id: 3, 
    date: "2025-03-18", 
    action: "Environmental Reporting", 
    result: "Passed", 
    compliance: "EPA Standards",
    user: "Jane Doe",
    notes: "Annual environmental impact report submitted on schedule"
  },
  { 
    id: 4, 
    date: "2025-03-15", 
    action: "Labor Standards Review", 
    result: "Passed", 
    compliance: "Fair Labor Act",
    user: "System Audit",
    notes: "All partner facilities meet or exceed required standards"
  },
  { 
    id: 5, 
    date: "2025-03-10", 
    action: "Data Retention Audit", 
    result: "Passed", 
    compliance: "CCPA",
    user: "System Audit",
    notes: "Automatic data retention policies functioning as expected"
  }
];

// Missing compliance item
const missingItems = [
  {
    id: 1,
    name: "Vulnerability Management Plan Update",
    dueDate: "2025-04-15",
    priority: "high",
    compliance: "Security Standards"
  },
  {
    id: 2,
    name: "Waste Management Policy Review",
    dueDate: "2025-04-10",
    priority: "medium",
    compliance: "Environmental Regulations"
  },
  {
    id: 3,
    name: "Wage Compliance Documentation",
    dueDate: "2025-04-05",
    priority: "medium",
    compliance: "Labor Standards"
  }
];

const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "violation":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  const handleComplianceAction = () => {
    toast.success("Compliance check initiated. Results will be available shortly.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Compliance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor regulatory compliance and audit activities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleComplianceAction}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Run Compliance Check
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audits">Audit Logs</TabsTrigger>
          <TabsTrigger value="actions">Required Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceAreas.map((area) => (
              <Card key={area.id} className="glass-morphism">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="bg-background/60 p-2 rounded-full">
                      {area.icon}
                    </div>
                    {getStatusIcon(area.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{area.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={area.compliance} className="h-2" />
                    <span className="text-sm font-medium">{area.compliance}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {area.lastUpdated}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
              <CardDescription>
                Detailed breakdown of compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {complianceAreas.map((area) => (
                  <div key={area.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {area.icon}
                      <h3 className="font-semibold">{area.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {area.details.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center px-4 py-2 bg-background/50 rounded-md">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(detail.status)}
                            <span>{detail.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{detail.score}%</span>
                            <Progress value={detail.score} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {area.id !== complianceAreas[complianceAreas.length - 1].id && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audits" className="space-y-4 mt-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Compliance Audit Logs</CardTitle>
              <CardDescription>
                Recent compliance checks and audit results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                  <div>Date</div>
                  <div className="col-span-2">Action</div>
                  <div>Result</div>
                  <div>Compliance</div>
                  <div>User</div>
                </div>
                {auditLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="grid grid-cols-6 p-3 text-sm hover:bg-muted/20 border-t"
                  >
                    <div className="text-muted-foreground">{log.date}</div>
                    <div className="col-span-2 font-medium">{log.action}</div>
                    <div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          log.result === "Passed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {log.result}
                      </span>
                    </div>
                    <div className="text-muted-foreground">{log.compliance}</div>
                    <div className="text-muted-foreground">{log.user}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4 mt-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Required Actions</CardTitle>
              <CardDescription>
                Compliance items requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missingItems.map((item) => (
                  <div key={item.id} className="flex justify-between p-4 bg-background/50 rounded-lg border-l-4 border-amber-500">
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="text-muted-foreground">Due: {item.dueDate}</div>
                        <div className="text-muted-foreground">{item.compliance}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      <Button variant="outline" size="sm">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDashboard;
