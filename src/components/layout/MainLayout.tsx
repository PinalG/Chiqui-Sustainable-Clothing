
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from './SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-6 md:p-8 bg-light-bg animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
