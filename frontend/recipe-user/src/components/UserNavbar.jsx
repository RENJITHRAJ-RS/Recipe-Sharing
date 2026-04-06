import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./UserNavbar.css";

export default function UserNavbar({ onSearch }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (onSearch) {
      onSearch(value);   // Send search to parent (Recipes page)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      
      {/* Logo */}
      <div className="logo">
        🍲 <span>Recipe Sharing</span>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Navigation Links */}
      <nav>
        <Link to="/recipes">Home</Link>
        <Link to="/addrecipe">Add Recipe</Link>
        <Link to="/myrecipe">My Recipes</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

    </header>
  );
}