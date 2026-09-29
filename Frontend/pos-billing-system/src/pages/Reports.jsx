import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Package, Users, Download } from "lucide-react";
import { getReports } from "../api/api";

function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getReports().then(setData).catch(() => alert("Unable to load reports."));
  }, []);

  if (!data) return <div className="reports-page"><h1>Reports</h1><p>Loading report data...</p></div>;

  const salesData = data.sales_by_day || [];
  const maxSales = Math.max(...salesData.map((x) => x.sales), 1);

  const exportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Sales", data.total_revenue],
      ["Total Orders", data.total_orders],
      ["Total Products", data.total_products],
      ["Low Stock Products", data.low_stock_products],
      ["Active Staff", data.active_staff],
      ["Returned Amount", data.returned_amount],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "pos-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div><h1>Reports</h1><p>Live sales, product and staff performance.</p></div>
        <button className="primary-button" onClick={exportReport}><Download size={18} /> Export Report</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><TrendingUp size={22} /></div><div><span>Total Sales</span><h2>₹{Number(data.total_revenue).toLocaleString("en-IN")}</h2></div></div>
        <div className="stat-card"><div className="stat-icon"><ShoppingCart size={22} /></div><div><span>Total Orders</span><h2>{data.total_orders}</h2></div></div>
        <div className="stat-card"><div className="stat-icon"><Package size={22} /></div><div><span>Total Products</span><h2>{data.total_products}</h2><small>{data.low_stock_products} low stock</small></div></div>
        <div className="stat-card"><div className="stat-icon"><Users size={22} /></div><div><span>Active Staff</span><h2>{data.active_staff}</h2></div></div>
      </div>

      <div className="dashboard-card report-chart-card">
        <div className="report-header"><div><h2>Sales Report</h2><p>Recent sales from the database</p></div></div>
        <div className="bar-chart">
          {salesData.length ? salesData.map((item) => (
            <div className="bar-column" key={item.day}>
              <span className="bar-value">₹{Number(item.sales).toLocaleString("en-IN")}</span>
              <div className="bar-wrapper"><div className="bar" style={{ height: `${(item.sales / maxSales) * 100}%` }} /></div>
              <span className="bar-label">{item.day}</span>
            </div>
          )) : <p>No sales recorded yet.</p>}
        </div>
      </div>

      <div className="report-grid">
        <div className="dashboard-card"><div className="report-header"><div><h2>Top Products</h2><p>Best selling products</p></div></div>
          <div className="report-list">{data.top_products.map((p) => <div className="report-row" key={p.name}><span>{p.name}</span><strong>{p.quantity} sold</strong></div>)}</div>
        </div>
        <div className="dashboard-card"><div className="report-header"><div><h2>Staff Performance</h2><p>Sales handled by staff</p></div></div>
          <div className="report-list">{data.staff_performance.map((p) => <div className="report-row" key={p.name}><span>{p.name}</span><strong>₹{Number(p.sales).toLocaleString("en-IN")}</strong></div>)}</div>
        </div>
      </div>
    </div>
  );
}
export default Reports;
