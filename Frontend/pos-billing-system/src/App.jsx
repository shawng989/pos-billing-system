import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/billing";
import Staff from "./pages/staff";
import Suppliers from "./pages/suppliers";
import Returns from "./pages/returns";
import Transactions from "./pages/Transactions";
import Ledger from "./pages/Ledger";
import Reports from "./pages/Reports";

function AppShell({ user, onLogout }) {
  const location = useLocation();
  const mobileMode =
    location.pathname === "/mobile-admin" ||
    new URLSearchParams(location.search).get("mobile") === "1";

  useEffect(() => {
    document.body.classList.toggle("mobile-admin-mode", mobileMode);
    return () => document.body.classList.remove("mobile-admin-mode");
  }, [mobileMode]);

  return (
    <div className={mobileMode ? "app force-mobile" : "app"}>
      <Sidebar user={user} mobileMode={mobileMode} />
      <div className="main">
        <Navbar user={user} onLogout={onLogout} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mobile-admin" element={<Dashboard />} />

            <Route element={<ProtectedRoute role={user.role} allowedRoles={["admin"]} />}>
              <Route path="/products" element={<Products />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route path="/returns" element={<Returns />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="*" element={<Navigate to={user.role === "admin" ? "/" : "/billing"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pos_user")) || null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("pos_user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      {user ? (
        <AppShell user={user} onLogout={logout} />
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
