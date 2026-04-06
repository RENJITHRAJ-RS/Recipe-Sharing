import "./AddRecipe.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    formData.append("cooking_time", Number(cookingTime));
    formData.append("difficulty", difficulty);

    if (image) {
      formData.append("image", image);
    }

    // DEBUG (VERY IMPORTANT)
    console.log("SENDING DATA:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/recipes/add/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Recipe added successfully ✅");
      navigate("/recipes");
    } catch (error) {
      console.error("BACKEND ERROR:", error.response?.data);
      alert("Failed to add recipe ❌");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">
        <h2>Add Recipe</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipe Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Ingredients"
            required
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />

          <textarea
            placeholder="Steps"
            required
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />

          <input
            type="number"
            placeholder="Cooking Time (minutes)"
            required
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </div>
  );
}
