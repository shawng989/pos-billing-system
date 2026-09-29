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

function Sidebar({ user, mobileMode }) {
  const allItems = [
    { name: "Dashboard", path: mobileMode ? "/mobile-admin?mobile=1" : "/", icon: LayoutDashboard, admin: false },
    { name: "Products", path: "/products", icon: Package, admin: true },
    { name: "Staff", path: "/staff", icon: Users, admin: true },
    { name: "Suppliers", path: "/suppliers", icon: Truck, admin: true },
    { name: "Returns", path: "/returns", icon: RotateCcw, admin: false },
    { name: "Billing", path: "/billing", icon: ShoppingCart, admin: false },
    { name: "Transactions", path: "/transactions", icon: Receipt, admin: false },
    { name: "Ledger", path: "/ledger", icon: BookOpen, admin: true },
    { name: "Reports", path: "/reports", icon: BarChart3, admin: true },
  ];

  const menuItems = allItems
    .filter((item) => !item.admin || user?.role === "admin")
    .map((item) => {
      if (mobileMode && item.path !== "/mobile-admin?mobile=1") {
        return { ...item, path: `${item.path}${item.path.includes("?") ? "&" : "?"}mobile=1` };
      }
      return item;
    });

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
              key={item.name}
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
        <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
        <div>
          <strong>{user?.name || "User"}</strong>
          <small>{user?.role === "admin" ? "Administrator" : "Staff"}</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
