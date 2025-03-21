
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from './SidebarContext';
import { Menu, User, Bell, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <div className="flex items-center md:gap-2">
            <span className="text-lg md:text-xl font-bold text-soft-pink">
              ACDRP
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center max-w-md w-full px-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-muted rounded-full py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-soft-pink transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
