import { Bell, Search, LogOut } from "lucide-react";

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="navbar-right">
        <button className="icon-button" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <strong>{user?.name || "User"}</strong>
            <span>{user?.role === "admin" ? "Administrator" : "Staff"}</span>
          </div>
        </div>

        <button className="icon-button" title="Logout" onClick={onLogout}>
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
