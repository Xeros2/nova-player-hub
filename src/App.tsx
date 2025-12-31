import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ResellerLayout } from "@/components/layout/ResellerLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import ActivatePage from "@/pages/public/ActivatePage";
import PlaylistsPage from "@/pages/public/PlaylistsPage";
import FAQPage from "@/pages/public/FAQPage";
import ContactPage from "@/pages/public/ContactPage";
import NewsPage from "@/pages/public/NewsPage";
import BlogPage from "@/pages/public/BlogPage";
import BecomeResellerPage from "@/pages/public/BecomeResellerPage";
import FindResellerPage from "@/pages/public/FindResellerPage";

// User Panel Pages
import PanelLoginPage from "@/pages/panel/PanelLoginPage";
import PanelDashboardPage from "@/pages/panel/PanelDashboardPage";
import PanelActivatePage from "@/pages/panel/PanelActivatePage";
import PanelPlaylistsPage from "@/pages/panel/PanelPlaylistsPage";

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminDevicesPage from "@/pages/admin/AdminDevicesPage";
import AdminResellersPage from "@/pages/admin/AdminResellersPage";
import AdminStatisticsPage from "@/pages/admin/AdminStatisticsPage";

// Reseller Pages
import ResellerLoginPage from "@/pages/reseller/ResellerLoginPage";
import ResellerDashboardPage from "@/pages/reseller/ResellerDashboardPage";
import ResellerActivatePage from "@/pages/reseller/ResellerActivatePage";
import ResellerHistoryPage from "@/pages/reseller/ResellerHistoryPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/activate" element={<ActivatePage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/become-reseller" element={<BecomeResellerPage />} />
            <Route path="/find-reseller" element={<FindResellerPage />} />
          </Route>

          {/* User Panel */}
          <Route path="/panel/login" element={<PanelLoginPage />} />
          <Route element={<PanelLayout />}>
            <Route path="/panel" element={<PanelDashboardPage />} />
            <Route path="/panel/activate" element={<PanelActivatePage />} />
            <Route path="/panel/playlists" element={<PanelPlaylistsPage />} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/devices" element={<AdminDevicesPage />} />
            <Route path="/admin/resellers" element={<AdminResellersPage />} />
            <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
            <Route path="/admin/settings" element={<AdminDashboardPage />} />
          </Route>

          {/* Reseller Panel */}
          <Route path="/reseller/login" element={<ResellerLoginPage />} />
          <Route element={<ResellerLayout />}>
            <Route path="/reseller" element={<ResellerDashboardPage />} />
            <Route path="/reseller/activate" element={<ResellerActivatePage />} />
            <Route path="/reseller/playlists" element={<ResellerActivatePage />} />
            <Route path="/reseller/history" element={<ResellerHistoryPage />} />
            <Route path="/reseller/credits" element={<ResellerDashboardPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
