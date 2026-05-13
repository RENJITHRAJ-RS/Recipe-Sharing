import "./Login.css";
import { useState } from "react";
import API from "../api"; // ✅ IMPORT API
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/login/", {
        email: email,
        password: password,
      });

      // ✅ SAVE LOGIN DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("user_name", res.data.name);

      alert("Login successful ✅");
      navigate("/recipes");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert("Invalid email or password ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}