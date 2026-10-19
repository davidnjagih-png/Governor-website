import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ContentProvider from "./lib/ContentProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import Vision from "./pages/Vision";
import News from "./pages/News";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// The admin area is a separate chunk: visitors never download it.
const Admin = lazy(() => import("./pages/admin/Admin"));

function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="vision" element={<Vision />} />
          <Route path="news" element={<News />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<p className="admin-loading">Loading...</p>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </ContentProvider>
  );
}

export default App;
