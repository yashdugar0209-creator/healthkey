import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/healthkey-logo.svg";

export default function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [open, setOpen] = useState(false);


  const NavButton = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="px-2 py-1 hover:text-[#0b5ed7]"
    >
      {label}
    </button>
  );

  const Dropdown = ({ label, items }) => (
    <div
      className="relative"
      onMouseEnter={() => setOpenMenu(label)}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <button className="flex items-center gap-1 px-2 py-1 hover:text-[#0b5ed7]">
        {label}
        <span className="text-xs">▾</span>
      </button>

      {openMenu === label && (
        <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-sm z-50">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setOpenMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="HealthKey" className="h-9 w-auto" />
          <span className="text-lg font-semibold text-[#083d77]">
            HealthKey
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <NavButton label="Home" onClick={() => navigate("/")} />

          <Dropdown
            label="About Us"
            items={[
              { label: "Our Vision", path: "/about" },
              { label: "Leadership", path: "/about" },
              { label: "Why HealthKey", path: "/about" },
            ]}
          />

          <Dropdown
            label="Features"
            items={[
              { label: "Patient Health ID", path: "/features" },
              { label: "Doctor Dashboard", path: "/features" },
              { label: "Hospital System", path: "/features" },
              { label: "NFC Integration", path: "/features" },
              { label: "ABHA Ready", path: "/features" },
            ]}
          />

          <NavButton label="Contact Us" onClick={() => navigate("/contact")} />

          <NavButton label="Login" onClick={() => navigate("/login")} />

          <button
            onClick={() => navigate("/register")}
            className="ml-2 px-4 py-2 rounded-lg bg-[#0b5ed7] text-white hover:bg-[#084298]"
          >
	<button
  	className="md:hidden text-2xl"
  	onClick={() => setOpen(!open)}
	>
  	☰
	</button>

            Register
          </button>
        </nav>
      </div>
    </header>
  );
}
