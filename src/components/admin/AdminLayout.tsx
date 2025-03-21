
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (currentPath.includes("/admin/users")) return "users";
    if (currentPath.includes("/admin/reports")) return "reports";
    return "dashboard";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "users":
        navigate("/admin/users");
        break;
      case "reports":
        navigate("/admin/reports");
        break;
      default:
        navigate("/admin/dashboard");
        break;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">
          Admin control panel for Chiqui platform management
        </p>
      </div>
      
      <Tabs defaultValue={getActiveTab()} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-soft-pink/10">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value={getActiveTab()} className="space-y-4">
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLayout;
