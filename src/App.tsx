
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManageDictionary from "./pages/ManageDictionary";
import Converter from "./pages/Converter";
import Phonetic from "./pages/Phonetic";
import MarkDown from "./pages/MarkDown";
import ManageTranslations from "./pages/ManageTranslations";
import SearchDictionary from "./pages/SearchDictionary";
import WordDictionary from "./pages/WordDictionary";
import SearchPhonetic from "./pages/SearchPhonetic";
import ManagePhonetic from "./pages/ManagePhonetic";
import Scrubber from "./pages/Scrubber";
import Diff from "./pages/Diff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dictionary" element={<WordDictionary />} />
          <Route path="/manage" element={<ManageDictionary />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/phonetic" element={<Phonetic />} />
          <Route path="/markdown" element={<MarkDown />} />
          <Route path="/translations" element={<ManageTranslations />} />
          <Route path="/search" element={<SearchDictionary />} />
          <Route path="/search-phonetic" element={<SearchPhonetic />} />
          <Route path="/manage-phonetic" element={<ManagePhonetic />} />
          <Route path="/scrubber" element={<Scrubber />} />
          <Route path="/diff" element={<Diff />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
