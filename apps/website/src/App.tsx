import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import { PublicLayout } from "@/components/layout/PublicLayout";

// Pages
import HomePage from "@/pages/HomePage";
import ActivatePage from "@/pages/ActivatePage";
import PlaylistsPage from "@/pages/PlaylistsPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import NewsPage from "@/pages/NewsPage";
import BlogPage from "@/pages/BlogPage";
import BecomeResellerPage from "@/pages/BecomeResellerPage";
import FindResellerPage from "@/pages/FindResellerPage";
import NotFound from "@/pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <Routes>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
