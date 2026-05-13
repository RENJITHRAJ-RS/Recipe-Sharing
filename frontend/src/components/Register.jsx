import "./Login.css";
import { useState } from "react";
import API from "../api"; // ✅ use central API
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ password check
    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await API.post("/api/register/", {
        name: fullName, // or username if backend needs
        email: email,
        password: password,
      });

      console.log("Response:", res.data);

      alert("Account created successfully ✅");
      navigate("/login");

      // clear form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Register error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}