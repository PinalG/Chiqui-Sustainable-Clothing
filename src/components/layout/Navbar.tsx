
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from './SidebarContext';
import { Menu, User, Bell, Settings, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-20 w-full">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {showMobileSearch ? (
          <div className="flex items-center w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-muted rounded-full py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-soft-pink transition-all"
                autoFocus
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMobileSearch(false)}
              className="ml-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="mr-2"
                  aria-label="Toggle sidebar menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center md:gap-2">
                <Button 
                  variant="ghost" 
                  className="p-0 text-lg md:text-xl font-bold text-soft-pink"
                  onClick={handleLogoClick}
                >
                  Chiqui
                </Button>
              </div>
            </div>

            <div className={cn("hidden md:flex items-center max-w-md w-full px-4")}>
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
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
              
              {/* Notifications Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-soft-pink"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-muted/50 cursor-pointer">
                      <p className="text-sm font-medium">New donation processed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-muted/50 cursor-pointer">
                      <p className="text-sm font-medium">Tax benefit report ready</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-soft-pink">
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Settings Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={handleSettingsClick}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
              
              {/* Profile Button - Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.photoURL || undefined} alt={userData?.displayName || "User"} />
                      <AvatarFallback className="bg-soft-pink text-white">
                        {getInitials(userData?.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData?.displayName || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
