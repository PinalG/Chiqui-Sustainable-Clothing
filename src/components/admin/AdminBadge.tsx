
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminBadgeProps {
  type: "admin" | "retailer" | "consumer" | "logistics" | "active" | "inactive" | "pending" | "approved" | "rejected";
  children: React.ReactNode;
  className?: string;
}

const AdminBadge = ({ type, children, className }: AdminBadgeProps) => {
  const getBadgeStyles = () => {
    switch (type) {
      case "admin":
        return "bg-soft-pink text-white";
      case "retailer":
        return "bg-blue-500 text-white";
      case "consumer":
        return "bg-heather-grey text-white";
      case "logistics":
        return "bg-amber-500 text-white";
      case "active":
        return "bg-green-500 text-white";
      case "inactive":
        return "bg-gray-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-soft-pink text-white";
    }
  };

  return (
    <Badge className={cn(getBadgeStyles(), className)}>
      {children}
    </Badge>
  );
};

export default AdminBadge;
