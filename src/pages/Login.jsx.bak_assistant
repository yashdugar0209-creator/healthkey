// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

const ROLES = ["patient", "doctor", "hospital", "admin"];

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await auth.login({ email, role, name: `${role}`.toUpperCase() });
      // role redirect
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "hospital") navigate("/hospital");
      else navigate("/dashboard"); // patient default
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }
useEffect(() => {
  const preset = searchParams.get("role");
  if (preset) setRole(preset);
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b57a6] to-[#063b78] text-white flex items-center">
      <Container className="py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white/6 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sign in</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-sm">Login as</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10">
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing..." : "Sign in"}</Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
