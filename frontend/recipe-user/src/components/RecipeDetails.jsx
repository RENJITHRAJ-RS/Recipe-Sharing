import "./RecipeDetails.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/recipes/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setRecipe({
          ...res.data,

          image: res.data.image
            ? `http://127.0.0.1:8000${res.data.image}`
            : "/default-food.jpg",

          author: res.data.created_by_name || "Unknown",
          views: res.data.view_count || 0,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Recipe details error:", err);
        alert("Failed to load recipe ❌");
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <h2 className="loading-text">Loading...</h2>;
  if (!recipe) return null;

  return (
    <>
      <UserNavbar />

      <div className="recipe-details-page">
        <div className="recipe-details-card">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-details-image"
          />

          <div className="recipe-details-content">
            <h2>{recipe.title}</h2>

            <div className="recipe-meta">
              <span>👤 {recipe.author}</span>
              <span>👁 {recipe.views} views</span>
              <span>🔥 {recipe.difficulty}</span>
              <span>⏱ {recipe.cooking_time} mins</span>
            </div>

            <div className="recipe-section">
              <h3>Ingredients</h3>
              <p>{recipe.ingredients}</p>
            </div>

            <div className="recipe-section">
              <h3>Steps</h3>
              <p>{recipe.steps}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
