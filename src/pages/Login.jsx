// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

/*
 Improved Login:
 - Shows specific messages for 404 (not registered) and 401 (wrong password)
 - Adds contextual CTAs (Register / Forgot password)
 - Keeps server-first auth, falls back to demo mode when server not reachable
 - Toggle SHOW_DETAILED_AUTH_ERRORS to false to return generic "Invalid credentials"
*/

const SHOW_DETAILED_AUTH_ERRORS = true; // set false to show only "Invalid credentials"

const ROLE_PASSWORDS = {
  admin: "adminpass",
  doctor: "doctorpass",
  hospital: "hospitalpass",
};

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(true);
  const [showRegisterCTA, setShowRegisterCTA] = useState(false);
  const [showForgotCTA, setShowForgotCTA] = useState(false);

  // if user came from a protected route
  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    const preset = searchParams.get("role");
    if (preset) {
      setRole(preset);
      setEmail(`${preset}@healthkey.local`);
    }
  }, [searchParams]);

  function validateDemoPassword(role, pwd) {
    if (!pwd || pwd.trim() === "") return false;
    const expected = ROLE_PASSWORDS[role];
    if (!expected) return true; // patients accept any non-empty for demo
    return pwd === expected;
  }

  // Actions when CTAs clicked
  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotClick = () => {
    navigate("/forgot");
  };

  // Main submit
  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setShowRegisterCTA(false);
    setShowForgotCTA(false);
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // success
      if (resp.status === 200) {
        const data = await resp.json().catch(() => ({}));
        if (data && data.token) {
          // Attempt to use token-aware login if your AuthContext supports it
          if (auth && typeof auth.login === "function") {
            try {
              await auth.login({
                email: data.user?.email || email,
                role: data.user?.role || role,
                name: data.user?.name || role,
                token: data.token,
              });
            } catch {
              // fallback silent
              await auth.login({ email, role, name: role });
            }
          }
        } else {
          // server returned success but no token -> still sign in demo-style
          await auth.login({ email, role, name: role });
        }

        // redirect
        if (from) navigate(from, { replace: true });
        else if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "doctor") navigate("/doctor", { replace: true });
        else if (role === "hospital") navigate("/hospital", { replace: true });
        else navigate("/dashboard", { replace: true });

        return;
      }

      // 401 wrong password
      if (resp.status === 401) {
        if (SHOW_DETAILED_AUTH_ERRORS) {
          const body = await resp.json().catch(() => ({}));
          setErrorMsg(body.message || "Wrong password. Please try again.");
        } else {
          setErrorMsg("Invalid credentials. Please check email and password.");
        }
        setShowForgotCTA(true);
        return;
      }

      // 404 not registered
      if (resp.status === 404) {
        if (SHOW_DETAILED_AUTH_ERRORS) {
          const body = await resp.json().catch(() => ({}));
          setErrorMsg(body.message || "No account found with that email. Please register first.");
        } else {
          setErrorMsg("Invalid credentials. Please check email and password.");
        }
        setShowRegisterCTA(true);
        return;
      }

      // 429 rate limit
      if (resp.status === 429) {
        setErrorMsg("Too many attempts. Please wait a few minutes and try again.");
        return;
      }

      // fallback for other errors
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        setErrorMsg(body.message || `Login failed (${resp.status}).`);
        return;
      }
    } catch (err) {
      // network/server unreachable -> demo fallback
      console.warn("Login network error:", err);
      setServerAvailable(false);

      if (validateDemoPassword(role, password)) {
        try {
          await auth.login({ email: email || `${role}@local`, role, name: role });
          if (from) navigate(from, { replace: true });
          else if (role === "admin") navigate("/admin", { replace: true });
          else if (role === "doctor") navigate("/doctor", { replace: true });
          else if (role === "hospital") navigate("/hospital", { replace: true });
          else navigate("/dashboard", { replace: true });

          setInfoMsg("Server not reachable — signed in using demo fallback.");
          return;
        } catch (err2) {
          console.error("Demo fallback failed:", err2);
          setErrorMsg("Unable to sign in. Please check network and try again.");
          return;
        }
      } else {
        setErrorMsg("Wrong password (demo) or server unreachable. Use demo passwords or try again.");
        setShowForgotCTA(true);
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042E52] to-[#083659] flex items-center py-12">
      <Container className="py-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left: branding */}
          <div className="hidden md:flex flex-col justify-center pl-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white text-xl font-bold">HK</div>
                <div>
                  <h1 className="text-2xl text-white font-extrabold">HealthKey</h1>
                  <p className="text-sm text-white/80">India's NFC Health ID — demo</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 text-white/90 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Welcome back</h3>
              <p className="text-sm text-white/80 mb-4">
                Sign in to access dashboards and clinical tools.
              </p>

              <ul className="text-sm space-y-2">
                <li>• Server-first authentication, demo fallback when offline.</li>
                <li>• Helpful inline errors and quick actions (Register / Forgot).</li>
                <li>• Demo passwords documented below for testing.</li>
              </ul>
            </div>

            <div className="mt-6 text-sm text-white/70">
              Not registered? <button onClick={handleRegisterClick} className="underline text-white">Create an account</button>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Sign in</h2>
                <p className="text-sm text-slate-500">Choose your role and sign in (demo-friendly, server-enabled).</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@hospital.example"
                    className="w-full px-3 py-2 rounded-md border border-slate-200 focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-1">Login as</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-slate-200"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="hospital">Hospital</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-1">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 rounded-md border border-slate-200"
                    required
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">
                      Demo passwords: <span className="font-medium text-slate-700">admin/adminpass</span>, <span className="font-medium text-slate-700">doctor/doctorpass</span>, <span className="font-medium text-slate-700">hospital/hospitalpass</span>. Patient accepts any password for demo.
                    </p>
                    <button type="button" onClick={handleForgotClick} className="text-xs text-sky-600 hover:underline">Forgot?</button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-sm text-rose-700 bg-rose-50 p-2 rounded">
                    {errorMsg}
                    <div className="mt-2 flex gap-2">
                      {showRegisterCTA && (
                        <button type="button" onClick={handleRegisterClick} className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded">
                          Register
                        </button>
                      )}
                      {showForgotCTA && (
                        <button type="button" onClick={handleForgotClick} className="text-xs border border-slate-200 px-3 py-1.5 rounded">
                          Forgot password
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {infoMsg && <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded">{infoMsg}</div>}

                {!serverAvailable && (
                  <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    Authentication server not reachable — demo fallback will be used if demo password matches.
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-4 text-center text-sm text-white/80">
              Or <button onClick={handleRegisterClick} className="underline">register</button> to create a demo account.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
