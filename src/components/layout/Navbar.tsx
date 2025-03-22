
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { useSidebar } from './SidebarContext';
import { Menu, User, Bell, Settings, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20 w-full transition-all duration-200",
      scrolled && "shadow-sm"
    )}>
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <AnimatePresence mode="wait">
          {showMobileSearch ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center w-full"
            >
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
            </motion.div>
          ) : (
            <motion.div 
              key="navbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="mr-2 hover:bg-soft-pink/10"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                )}
                <div className="flex items-center md:gap-2">
                  <span className="text-lg md:text-xl font-bold text-soft-pink">
                    Chiqui
                  </span>
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
                    className="rounded-full hover:bg-soft-pink/10"
                    onClick={() => setShowMobileSearch(true)}
                  >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-soft-pink/10"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-soft-pink/10 hidden md:flex"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-soft-pink/10"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
