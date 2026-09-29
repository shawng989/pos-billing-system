import { useState } from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { loginUser } from "../api/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@pos.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser({ email, password });
      localStorage.setItem("pos_user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon"><ShieldCheck size={28} /></div>
        <h1>POS Billing System</h1>
        <p>Sign in to continue</p>

        {error && <div className="login-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="primary-button login-button" disabled={loading}>
          <LogIn size={18} />
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="demo-credentials">
          <strong>Demo accounts</strong>
          <span>Admin: admin@pos.local / Admin@123</span>
          <span>Staff: staff@pos.local / Staff@123</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
