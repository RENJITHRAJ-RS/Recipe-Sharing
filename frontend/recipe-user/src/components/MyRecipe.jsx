import "./MyRecipe.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function MyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/recipes/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const myRecipes = res.data
          .filter((recipe) => String(recipe.created_by) === String(userId))
          .map((recipe) => ({
            ...recipe,
            image: recipe.image
              ? `http://127.0.0.1:8000${recipe.image}`
              : "/default-food.jpg",
            author: "You",
            views: recipe.view_count ?? 0,
          }));

        setRecipes(myRecipes);
      })
      .catch((err) => {
        console.error("MyRecipe fetch error:", err);
        alert("Failed to load recipes ❌");
      });
  }, [navigate]);

  // ================= DELETE =================
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/recipes/delete/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Delete failed ❌");
      });
  };

  return (
    <>
      <UserNavbar />

      <div className="recipes-page">
        <h2>My Recipes</h2>

        <div className="recipes-grid">
          {recipes.length === 0 && <p>No recipes found.</p>}

          {recipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <img src={recipe.image} alt={recipe.title} />

              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <p>👤 {recipe.author}</p>
                <p>👁 {recipe.views} views</p>

                <Link
                  to={`/recipedetails/${recipe.id}`}
                  className="view-btn"
                >
                  View Recipe
                </Link>

                {/* ACTION BUTTONS */}
                <div className="recipe-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/editrecipe/${recipe.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
