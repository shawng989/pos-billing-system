import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  RotateCcw,
  ShoppingCart,
  Receipt,
  BookOpen,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
    },
    {
      name: "Staff",
      path: "/staff",
      icon: Users,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: Truck,
    },
    {
      name: "Returns",
      path: "/returns",
      icon: RotateCcw,
    },
    {
      name: "Billing",
      path: "/billing",
      icon: ShoppingCart,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: Receipt,
    },
    {
      name: "Ledger",
      path: "/ledger",
      icon: BookOpen,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">P</div>

        <div>
          <h2>POS</h2>
          <span>Billing System</span>
        </div>
      </div>

      <nav>

        <p className="menu-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-bottom">
        <div className="user-avatar">A</div>

        <div>
          <strong>Admin User</strong>
          <small>Administrator</small>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;