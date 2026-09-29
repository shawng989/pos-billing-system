import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  Download,
} from "lucide-react";

function Reports() {
  const salesData = [
    { day: "Mon", sales: 4200 },
    { day: "Tue", sales: 6800 },
    { day: "Wed", sales: 5100 },
    { day: "Thu", sales: 8200 },
    { day: "Fri", sales: 7600 },
    { day: "Sat", sales: 9800 },
    { day: "Sun", sales: 7200 },
  ];

  const maxSales = Math.max(
    ...salesData.map((item) => item.sales)
  );

  return (
    <div className="reports-page">


      <div className="page-header">

        <div>
          <h1>Reports</h1>
          <p>
            View sales, product and staff performance reports.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            alert("Report export will be connected to the backend.")
          }
        >
          <Download size={18} />
          Export Report
        </button>

      </div>

    

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Total Sales</span>
            <h2>₹48,250</h2>
            <small>↑ 12.5% this week</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <ShoppingCart size={22} />
          </div>

          <div>
            <span>Total Orders</span>
            <h2>128</h2>
            <small>↑ 8.2% this week</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Products Sold</span>
            <h2>356</h2>
            <small>Across all categories</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Active Staff</span>
            <h2>12</h2>
            <small>10 currently active</small>
          </div>

        </div>

      </div>


      <div className="dashboard-card report-chart-card">

        <div className="report-header">

          <div>
            <h2>Sales Report</h2>
            <p>
              Sales performance for the current week
            </p>
          </div>

          <select>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

        </div>

        <div className="bar-chart">

          {salesData.map((item) => {

            const height =
              (item.sales / maxSales) * 100;

            return (
              <div
                className="bar-column"
                key={item.day}
              >

                <span className="bar-value">
                  ₹
                  {item.sales.toLocaleString("en-IN")}
                </span>

                <div className="bar-wrapper">

                  <div
                    className="bar"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span className="bar-label">
                  {item.day}
                </span>

              </div>
            );
          })}

        </div>

      </div>


      <div className="report-grid">

        <div className="dashboard-card">

          <div className="report-header">

            <div>
              <h2>Top Products</h2>
              <p>Best selling products</p>
            </div>

            <Package size={22} />

          </div>

          <div className="report-list">

            <div className="report-row">
              <span>Cotton Shirt</span>
              <strong>86 sold</strong>
            </div>

            <div className="report-row">
              <span>Denim Jeans</span>
              <strong>64 sold</strong>
            </div>

            <div className="report-row">
              <span>Silk Saree</span>
              <strong>48 sold</strong>
            </div>

            <div className="report-row">
              <span>Linen Shirt</span>
              <strong>42 sold</strong>
            </div>

            <div className="report-row">
              <span>Casual Trousers</span>
              <strong>37 sold</strong>
            </div>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="report-header">

            <div>
              <h2>Staff Performance</h2>
              <p>Sales handled by staff</p>
            </div>

            <Users size={22} />

          </div>

          <div className="report-list">

            <div className="report-row">
              <span>Admin User</span>
              <strong>₹18,450</strong>
            </div>

            <div className="report-row">
              <span>John Staff</span>
              <strong>₹12,850</strong>
            </div>

            <div className="report-row">
              <span>Sarah Staff</span>
              <strong>₹9,620</strong>
            </div>

            <div className="report-row">
              <span>Arun Staff</span>
              <strong>₹7,330</strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;