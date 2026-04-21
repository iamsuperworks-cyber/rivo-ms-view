import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UploadProvider } from "./contexts/UploadContext";
import { WelcomeStateProvider } from "./contexts/WelcomeStateContext";
import AppSidebar from "./components/AppSidebar";
import TopBar from "./components/TopBar";
import AccountSettings from "./pages/AccountSettings.tsx";
import Index from "./pages/Index.tsx";
import WelcomeHome from "./pages/WelcomeHome.tsx";
import UploadDocuments from "./pages/UploadDocuments.tsx";
import BankList from "./pages/BankList.tsx";
import ApplicationTracking from "./pages/ApplicationTracking.tsx";
import DocumentsToSign from "./pages/DocumentsToSign.tsx";
import NotFound from "./pages/NotFound.tsx";
import HomePage from "./pages/HomePage.tsx";
import Login from "./pages/Login.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";

const queryClient = new QueryClient();

const AppLayout = () => {
  const isAuthenticated = sessionStorage.getItem("authenticated");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 relative" style={{ marginLeft: 220 }}>
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UploadProvider>
        <WelcomeStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyOtp />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadDocuments />} />
              <Route path="/banks" element={<BankList />} />
              <Route path="/track" element={<ApplicationTracking />} />
              <Route path="/sign" element={<DocumentsToSign />} />
              <Route path="/account" element={<AccountSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </WelcomeStateProvider>
      </UploadProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
