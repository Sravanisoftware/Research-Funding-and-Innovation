import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("researcher");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/register", {
        name,
        email,
        password,
        role,
      });

      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.detail ||
          "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-10 shadow-xl">

        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-cyan-400">
          ResearchX
        </h1>

        <p className="mb-8 mt-2 text-center text-slate-400">
          Create your account
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              required
              minLength={6}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-slate-300">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="researcher">Researcher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Link to login */}
        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
