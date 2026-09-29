import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="navbar-right">

        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="profile">

          <div className="profile-avatar">
            A
          </div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;