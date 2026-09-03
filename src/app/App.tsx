import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { ContactPage } from "./pages/ContactPage";
import { ExplorePage } from "./pages/ExplorePage";
import { GuidePage } from "./pages/GuidePage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SimulatorPage } from "./pages/SimulatorPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/case-study" element={<CaseStudyPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
