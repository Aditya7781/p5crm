import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Clients from "./components/Clients";
import Staff from "./components/Staff";
import Login from "./components/Login";
import Accounts from "./components/Accounts";

// 🆕 import your new pages
import ProjectLead from "./components/ProjectLead";
import Working from "./components/Working";
import FigmaRepository from "./components/FigmaRepository";
import Frontend from "./components/Frontend";
import Backend from "./components/Backend";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        {/* Redirect root */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/projects"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Projects />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/clients"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Clients />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/staff"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Staff />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/accounts"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Accounts />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 🆕 Additional routes */}
        <Route
          path="/projectLead"
          element={
            isLoggedIn ? (
              <AppLayout>
                <ProjectLead />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/working"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Working />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/FigmaRepository"
          element={
            isLoggedIn ? (
              <AppLayout>
                <FigmaRepository />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/frontend"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Frontend />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/backend"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Backend />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
