"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import BlogDetail from "./pages/BlogDetail";
import SeriesList from "./pages/SeriesList";
import SeriesDetail from "./pages/SeriesDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogForm from "./pages/admin/BlogForm";
import BlogPreview from "./pages/admin/BlogPreview";
import SeriesForm from "./pages/admin/SeriesForm";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { authService } from "./services/authService";

const queryClient = new QueryClient();

// Protected route wrapper for admin routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/create" 
              element={
                <ProtectedRoute>
                  <BlogForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/:id/edit" 
              element={
                <ProtectedRoute>
                  <BlogForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/:id/preview" 
              element={
                <ProtectedRoute>
                  <BlogPreview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/preview" 
              element={
                <ProtectedRoute>
                  <BlogPreview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/series/create" 
              element={
                <ProtectedRoute>
                  <SeriesForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/series/:id/edit" 
              element={
                <ProtectedRoute>
                  <SeriesForm />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
