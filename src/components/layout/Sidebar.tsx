
import { cn } from '@/lib/utils';
import { 
  Home, ShoppingBag, Heart, Tags, 
  BarChart2, FileText, Package, Truck, HelpCircle, 
  Menu, X, User, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal hover:bg-soft-pink/10 rounded-lg px-3 py-2 transition-all",
          active && "bg-soft-pink/10 text-soft-pink"
        )}
      >
        <Icon className={cn("h-5 w-5", active && "text-soft-pink")} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location.pathname, isMobile, closeSidebar]);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
    { icon: Heart, label: 'Donations', href: '/donations' },
    { icon: Tags, label: 'Paper Donations', href: '/paper-donations' },
    { icon: Users, label: 'Retailers', href: '/retailers' },
    { icon: BarChart2, label: 'Analytics', href: '/analytics' },
    { icon: FileText, label: 'Tax Benefits', href: '/tax-benefits' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: Truck, label: 'Logistics', href: '/logistics' },
    { icon: HelpCircle, label: 'Support', href: '/support' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 transition-opacity animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          isSidebarOpen 
            ? "translate-x-0 shadow-xl md:shadow-none" 
            : "-translate-x-full md:translate-x-0 md:w-20",
          "bg-white border-r border-border flex flex-col",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className={cn("flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
            <div className="w-8 h-8 rounded-md bg-soft-pink flex items-center justify-center">
              <span className="font-bold text-white">CH</span>
            </div>
            <span className={cn("font-semibold", !isSidebarOpen && "hidden md:hidden")}>
              Chiqui
            </span>
          </div>
          
          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          {!isSidebarOpen && !isMobile && (
            <div className="hidden md:flex items-center justify-center w-full">
              <div className="w-8 h-8 rounded-md bg-soft-pink flex items-center justify-center">
                <span className="font-bold text-white">CH</span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-auto py-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className={cn(
            "flex items-center gap-3 px-2 py-2",
            !isSidebarOpen && "md:justify-center"
          )}>
            <div className="w-10 h-10 rounded-full bg-heather-grey flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className={cn("flex-1 truncate", !isSidebarOpen && "hidden")}>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-muted-foreground">admin@chiqui.org</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
