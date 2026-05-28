import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Messages from "./pages/Messages";
import Login from "./pages/Login";
import HomeCMS from "./pages/HomeCMS";
import AboutCMS from "./pages/AboutCMS";
import JourneyCMS from "./pages/JourneyCMS";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route path="/login" element={<Login />} />

        {/* ROOT REDIRECT */}

        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* PROJECTS */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Projects />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* SKILLS */}

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Skills />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* MESSAGES */}

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Messages />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* HOME CMS */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <HomeCMS />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ABOUT CMS */}

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AboutCMS />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* JOURNEY CMS */}

        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <JourneyCMS />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
