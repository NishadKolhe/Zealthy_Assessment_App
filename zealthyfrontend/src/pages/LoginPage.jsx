import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import api from "../api/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/patients/login/", { email, password });

      // Assuming the backend returns { patient: {...}, token: "..." }
      const { patient } = response.data;

      localStorage.setItem("patient", JSON.stringify(patient));

      // Redirect to patient dashboard
      navigate("/patient/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <h1 className="login-title">Zealthy MiniEMR</h1>
        <p className="login-subtitle">Patient Portal by Nishad Kolhe</p>

        <div className="login-card">
          <h2 className="login-card-title">Sign In</h2>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="admin-link">
          <button onClick={() => navigate("/admin")}>Admin Portal →</button>
        </div>
      </div>
    </div>
  );
}
