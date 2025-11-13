import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlogDetail from "./pages/BlogDetail";
import SeriesList from "./pages/SeriesList";
import SeriesDetail from "./pages/SeriesDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogForm from "./pages/admin/BlogForm";
import SeriesForm from "./pages/admin/SeriesForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blogs/create" element={<BlogForm />} />
          <Route path="/admin/blogs/:id/edit" element={<BlogForm />} />
          <Route path="/admin/series/create" element={<SeriesForm />} />
          <Route path="/admin/series/:id/edit" element={<SeriesForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
