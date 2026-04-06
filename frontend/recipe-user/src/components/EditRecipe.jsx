import "./AddRecipe.css"; // reuse same CSS (NO UI CHANGE)
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  // ================= LOAD EXISTING RECIPE =================
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
        const r = res.data;

        setTitle(r.title);
        setIngredients(r.ingredients);
        setSteps(r.steps);
        setCookingTime(r.cooking_time);
        setDifficulty(r.difficulty);
        setOldImage(
          r.image ? `http://127.0.0.1:8000${r.image}` : ""
        );
      })
      .catch((err) => {
        console.error("Edit load error:", err);
        alert("Failed to load recipe ❌");
        navigate("/myrecipe");
      });
  }, [id, navigate]);

  // ================= UPDATE RECIPE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    formData.append("cooking_time", cookingTime);
    formData.append("difficulty", difficulty);

    // append image only if changed
    if (image !== null) {
      formData.append("image", image);
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/recipes/edit/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert("Recipe updated successfully ✅");
      navigate("/myrecipe");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      alert("Update failed ❌");
    }
  };

  return (
    <>
      <UserNavbar />

      <div className="add-container">
        <div className="add-card">
          <h2>Edit Recipe</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />

            <textarea
              placeholder="Steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Cooking Time (minutes)"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              required
            />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            {/* EXISTING IMAGE */}
            {oldImage && (
              <img
                src={oldImage}
                alt="Current"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
            )}

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button type="submit">Update Recipe</button>
          </form>
        </div>
      </div>
    </>
  );
}
