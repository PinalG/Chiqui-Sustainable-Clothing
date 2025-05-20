
import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Sarah Consumer",
    email: "consumer@example.com",
    role: "consumer" as UserRole,
    status: "active",
    joinDate: "2023-09-15",
    lastActive: "2023-11-10",
    rewardsPoints: 250,
  },
  {
    id: "2",
    name: "John Retailer",
    email: "retailer@example.com",
    role: "retailer" as UserRole,
    status: "active",
    joinDate: "2023-08-20",
    lastActive: "2023-11-09",
    organizationName: "EcoFashion Inc.",
  },
  {
    id: "3",
    name: "Mike Logistics",
    email: "logistics@example.com",
    role: "logistics" as UserRole,
    status: "active",
    joinDate: "2023-07-10",
    lastActive: "2023-11-08",
    organizationName: "FastShip Logistics",
  },
  {
    id: "4",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "consumer" as UserRole,
    status: "inactive",
    joinDate: "2023-06-05",
    lastActive: "2023-09-15",
    rewardsPoints: 120,
  },
  {
    id: "5",
    name: "Robert Smith",
    email: "robert@fashionco.com",
    role: "retailer" as UserRole,
    status: "pending",
    joinDate: "2023-10-20",
    lastActive: "2023-10-20",
    organizationName: "Fashion Co.",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success(`User status updated to ${newStatus}`);
  };
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    toast.success(`User role updated to ${newRole}`);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };
  
  const handleSendEmail = (email: string) => {
    toast.success(`Email notification sent to ${email}`);
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
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserManagement;
