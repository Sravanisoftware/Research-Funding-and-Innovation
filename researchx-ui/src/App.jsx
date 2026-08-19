import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patents from "./pages/Patents";
import Funding from "./pages/Funding";
import Technologies from "./pages/Technologies";
import AIInsights from "./pages/AIInsights";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patents"
          element={
            <ProtectedRoute>
              <Patents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/funding"
          element={
            <ProtectedRoute>
              <Funding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technologies"
          element={
            <ProtectedRoute>
              <Technologies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <AIInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;