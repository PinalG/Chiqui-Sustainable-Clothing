
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreHorizontal,
  UserCog,
  UserX,
  Mail,
  Shield,
  Tag,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  joinDate: string;
  lastActive: string;
  rewardsPoints?: number;
  organizationName?: string;
}

// Fetch users from API
const fetchUsers = async (): Promise<User[]> => {
  try {
    // In a real implementation, this would fetch from your backend API
    // const response = await fetch('/api/admin/users');
    // if (!response.ok) throw new Error('Failed to fetch users');
    // return await response.json();
    
    // For development, return an empty array
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch users
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
  });
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // In a real implementation, this would update the user status via an API call
      // const response = await fetch(`/api/admin/users/${userId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // if (!response.ok) throw new Error('Failed to update user status');
      
      // Refetch users to get updated data
      refetch();
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    }
  };
  
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // In a real implementation, this would update the user role via an API call
      // const response = await fetch(`/api/admin/users/${userId}/role`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role: newRole })
      // });
      // if (!response.ok) throw new Error('Failed to update user role');
      
      // Refetch users to get updated data
      refetch();
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      // In a real implementation, this would delete the user via an API call
      // const response = await fetch(`/api/admin/users/${userId}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete user');
      
      // Refetch users to get updated data
      refetch();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };
  
  const handleSendEmail = async (email: string) => {
    try {
      // In a real implementation, this would send an email via an API call
      // const response = await fetch('/api/admin/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // if (!response.ok) throw new Error('Failed to send email');
      
      toast.success(`Email notification sent to ${email}`);
    } catch (error) {
      toast.error("Failed to send email");
      console.error(error);
    }
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-soft-pink text-white">Admin</Badge>;
      case "retailer":
        return <Badge className="bg-blue-500 text-white">Retailer</Badge>;
      case "logistics":
        return <Badge className="bg-amber-500 text-white">Logistics</Badge>;
      default:
        return <Badge className="bg-heather-grey text-white">Consumer</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500 text-white">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return <Badge className="bg-gray-400 text-white">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout title="User Management">
      <Card className="backdrop-blur-sm bg-white/80 border-none shadow-md">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <UserCog className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-soft-pink" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-soft-pink/5">
                      <TableCell className="font-medium">
                        {user.name}
                        {user.organizationName && (
                          <div className="text-xs text-muted-foreground">
                            {user.organizationName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleSendEmail(user.email)}>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Set Active</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              <span>Suspend</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin" as UserRole)}>
                              <Tag className="mr-2 h-4 w-4" />
                              <span>Make Admin</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Delete User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserManagement;
