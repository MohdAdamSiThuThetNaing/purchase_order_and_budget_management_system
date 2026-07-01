import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ApiError } from "../types/auth";
import "../layouts/LoginPage.css";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const apiError: ApiError | undefined = err?.response?.data;
      setError(
        apiError?.message ??
          "Unable to sign in. Check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Purchase Order &amp; Budget Management</p>

        <label className="login-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          disabled={isSubmitting}
        />

        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          disabled={isSubmitting}
        />

        {error && (
          <p role="alert" className="login-error">
            {error}
          </p>
        )}

        <div className="login-actions">
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            className="login-cancel-button"
            onClick={() => {
              setEmail("");
              setPassword("");
              setError(null);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
