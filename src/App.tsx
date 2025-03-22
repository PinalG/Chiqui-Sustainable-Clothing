
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Routes from "./routes/routes";
import { AuthProvider } from "./contexts/AuthContext";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import { I18nProvider } from "./contexts/I18nContext";
import { DidAuthProvider } from "./contexts/DidAuthContext";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster as SonnerToaster } from "sonner";

// Create a QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-soft-pink" />
      </div>
    }>
      <Router>
        <QueryClientProvider client={queryClient}>
          <PerformanceProvider>
            <AuthProvider>
              <DidAuthProvider>
                <I18nProvider>
                  <Routes />
                  <Toaster />
                  <SonnerToaster 
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: 'white',
                        color: 'rgb(51, 51, 51)',
                        border: '1px solid rgb(229, 231, 235)',
                      },
                    }}
                  />
                </I18nProvider>
              </DidAuthProvider>
            </AuthProvider>
          </PerformanceProvider>
        </QueryClientProvider>
      </Router>
    </Suspense>
  );
};

export default App;
