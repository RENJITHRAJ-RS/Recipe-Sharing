import { Link } from "react-router-dom";
import "./UserNavbar.css";

export default function UserNavbar() {
  return (
    <header className="navbar">
      <div className="logo">
        🍲 <span>Recipe Sharing</span>
      </div>

      <nav>
        <Link to="/recipes">Home</Link>
        <Link to="/addrecipe">Add Recipes</Link>
        <Link to="/myrecipe">My Recipes</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login" className="logout-btn">Logout</Link>
      </nav>
    </header>
  );
}
