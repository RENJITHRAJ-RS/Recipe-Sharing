import "./Recipes.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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
        const fixedData = res.data.map((recipe) => ({
          ...recipe,
          image: recipe.image
            ? `http://127.0.0.1:8000${recipe.image}`
            : "/default-food.jpg",
        }));

        setRecipes(fixedData);
      })
      .catch((err) => {
        console.error("Recipe fetch error:", err);
        alert("Failed to load recipes ❌");
      });
  }, [navigate]);

  return (
    <>
      <UserNavbar />

      <div className="recipes-page">
        <h2>All Recipes</h2>

        <div className="recipes-grid">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
