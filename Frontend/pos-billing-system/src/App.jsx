import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/NavBar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/billing";
import Staff from "./pages/staff";
import Suppliers from "./pages/suppliers";
import Returns from "./pages/returns";
import Transactions from "./pages/Transactions";
import Ledger from "./pages/Ledger";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Sidebar />

        <div className="main">

          <Navbar />

          <main className="content">
            <Routes>

              <Route path="/" element={<Dashboard />} />

              <Route path="/products" element={<Products />} />

              <Route path="/staff" element={<Staff />} />

              <Route path="/suppliers" element={<Suppliers />} />

              <Route path="/returns" element={<Returns />} />

              <Route path="/billing" element={<Billing />} />

              <Route path="/transactions" element={<Transactions />} />

              <Route path="/ledger" element={<Ledger />} />

              <Route path="/reports" element={<Reports />} />

            </Routes>
          </main>

        </div>

      </div>
    </BrowserRouter>
  );
}
export default App;