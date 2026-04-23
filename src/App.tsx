import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import SmoothScroll from "./components/SmoothScroll";
import CursorFollower from "./components/CursorFollower";
import ScrollProgress from "./components/ScrollProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SmoothScroll>
        <CursorFollower />
        <ScrollProgress />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SmoothScroll>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
