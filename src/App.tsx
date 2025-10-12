import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import Landing from "./pages/Landing";
import Access from "./pages/Access";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import NewRecord from "./pages/NewRecord";
import RecordDetail from "./pages/RecordDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => {
  const { theme } = useUIStore();

  useEffect(() => {
    // Initialize theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <TooltipProvider>
      <AccountSync />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/new" element={<NewRecord />} />
          <Route path="/records/:id" element={<RecordDetail />} />
          <Route path="/access" element={<Access />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;

const AccountSync = () => {
  const { address, isConnected } = useAccount();
  const connect = useAuthStore(state => state.connect);
  const disconnect = useAuthStore(state => state.disconnect);

  useEffect(() => {
    if (isConnected && address) {
      connect(address);
    } else {
      disconnect();
    }
  }, [address, connect, disconnect, isConnected]);

  return null;
};
