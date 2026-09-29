import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 6800 },
  { day: "Wed", sales: 5100 },
  { day: "Thu", sales: 8200 },
  { day: "Fri", sales: 7600 },
  { day: "Sat", sales: 9800 },
  { day: "Sun", sales: 7200 },
];

const transactions = [
  {
    id: "#INV-1001",
    customer: "Walk-in Customer",
    amount: "₹2,450",
    method: "UPI",
    status: "Paid",
  },
  {
    id: "#INV-1002",
    customer: "Rahul Textiles",
    amount: "₹4,800",
    method: "Cash",
    status: "Paid",
  },
  {
    id: "#INV-1003",
    customer: "Anjali",
    amount: "₹1,750",
    method: "Card",
    status: "Paid",
  },
  {
    id: "#INV-1004",
    customer: "Walk-in Customer",
    amount: "₹3,200",
    method: "UPI",
    status: "Paid",
  },
];

const lowStock = [
  {
    name: "Cotton Shirt",
    stock: 4,
  },
  {
    name: "Denim Jeans",
    stock: 6,
  },
  {
    name: "Silk Saree",
    stock: 3,
  },
];

function Dashboard() {
  return (
    <div className="dashboard">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here's today's overview.</p>
        </div>

        <button className="primary-button">
          + New Sale
        </button>
      </div>

      {/* STAT CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <IndianRupee size={22} />
          </div>

          <div>
            <p>Total Sales</p>
            <h2>₹48,250</h2>
            <span className="positive">
              <ArrowUpRight size={14} />
              12.5% this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShoppingCart size={22} />
          </div>

          <div>
            <p>Total Orders</p>
            <h2>128</h2>
            <span className="positive">
              <ArrowUpRight size={14} />
              8.2% this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Package size={22} />
          </div>

          <div>
            <p>Total Products</p>
            <h2>542</h2>
            <span>12 low stock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={22} />
          </div>

          <div>
            <p>Active Staff</p>
            <h2>12</h2>
            <span>10 currently active</span>
          </div>
        </div>

      </div>

      {/* CHART + LOW STOCK */}

      <div className="dashboard-grid">

        <div className="dashboard-card chart-card">

          <div className="card-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Sales performance for this week</p>
            </div>

            <select>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={salesData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* LOW STOCK */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Low Stock</h3>
              <p>Products that need attention</p>
            </div>

            <AlertTriangle size={20} />

          </div>

          <div className="stock-list">

            {lowStock.map((product) => (

              <div className="stock-item" key={product.name}>

                <div>
                  <strong>{product.name}</strong>
                  <span>Only {product.stock} left</span>
                </div>

                <span className="stock-warning">
                  Low
                </span>

              </div>

            ))}

          </div>

          <button className="text-button">
            View all products →
          </button>

        </div>

      </div>

      {/* TRANSACTIONS */}

      <div className="dashboard-card transactions-card">

        <div className="card-header">

          <div>
            <h3>Recent Transactions</h3>
            <p>Latest billing transactions</p>
          </div>

          <button className="text-button">
            View all
          </button>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {transactions.map((transaction) => (

                <tr key={transaction.id}>

                  <td>
                    <strong>{transaction.id}</strong>
                  </td>

                  <td>{transaction.customer}</td>

                  <td>{transaction.amount}</td>

                  <td>{transaction.method}</td>

                  <td>
                    <span className="status-paid">
                      {transaction.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;