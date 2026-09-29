import { useEffect, useState } from "react";
import { IndianRupee, ShoppingCart, Package, Users, AlertTriangle, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { getReports } from "../api/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { getReports().then(setData).catch(() => {}); }, []);

  const salesData = data?.sales_by_day || [];
  const stats = data || { total_revenue: 0, total_orders: 0, total_products: 0, active_staff: 0, low_stock_products: 0 };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div><h1>Dashboard</h1><p>Live overview of your POS system.</p></div>
        <Link className="primary-button" to="/billing">+ New Sale</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon blue"><IndianRupee size={22} /></div><div><p>Total Sales</p><h2>₹{Number(stats.total_revenue).toLocaleString("en-IN")}</h2><span>From recorded bills</span></div></div>
        <div className="stat-card"><div className="stat-icon green"><ShoppingCart size={22} /></div><div><p>Total Orders</p><h2>{stats.total_orders}</h2><span>Completed sales</span></div></div>
        <div className="stat-card"><div className="stat-icon orange"><Package size={22} /></div><div><p>Total Products</p><h2>{stats.total_products}</h2><span>{stats.low_stock_products} low stock</span></div></div>
        <div className="stat-card"><div className="stat-icon purple"><Users size={22} /></div><div><p>Active Staff</p><h2>{stats.active_staff}</h2><span>Active accounts</span></div></div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card">
          <div className="card-header"><div><h3>Sales Overview</h3><p>Recent sales recorded in the database</p></div></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><div><h3>Inventory Alert</h3><p>Products needing attention</p></div><AlertTriangle size={20} /></div>
          <div className="stock-list"><div className="stock-item"><div><strong>Low stock products</strong><span>{stats.low_stock_products} products at or below 5 units</span></div><span className="stock-warning">Check</span></div></div>
          <Link className="text-button" to="/products">View products →</Link>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
