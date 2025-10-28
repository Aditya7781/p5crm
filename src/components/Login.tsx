import React, { useState } from "react";
import logo from "../assets/P5.png";
import illustration from "../assets/illustration.png";
import { loginUser } from "../services/authService";

interface LoginProps {
  onLogin: () => void;
}

/* Background with white rounded boundary and scooped curve */
const ScoopedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-white via-white to-white overflow-hidden">
      <div className="relative mx-3 my-3 md:m-5 h-[calc(100dvh-24px)] md:h-[calc(100dvh-40px)] rounded-[26px] border-4 border-white bg-white overflow-hidden">
        <div className="relative h-full w-full bg-purple-900 overflow-hidden">
          {/* White scooped curve */}
          <svg
            className="pointer-events-none select-none absolute bottom-[-1px] left-0 w-[105%] sm:w-[85%] md:w-[70%] max-w-[920px] h-[34%] sm:h-[40%] md:h-[46%]"
            viewBox="0 0 1000 650"
            preserveAspectRatio="none"
            aria-hidden
            shapeRendering="geometricPrecision"
          >
            <path
              d="M -2 652 L 1002 652 L 820 652 C 745 618, 670 583, 560 560 C 430 532, 220 520, -2 520 Z"
              fill="white"
              stroke="none"
            />
          </svg>

          {/* Content layer */}
          <div className="relative h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill all fields!");
      return;
    }
    try {
      const data = await loginUser(email, password, role);
      console.log("Login response:", data);

      // Save token, role, and login flag
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", role);
      localStorage.setItem("isLoggedIn", "true");

      alert("✅ Login successful!");

      // Redirect based on role
      switch (role) {
        case "frontend":
          window.location.href = "/frontend";
          break;
        case "backend":
          window.location.href = "/backend";
          break;
        case "accounts":
          window.location.href = "/accounts";
          break;
        case "project lead":
          window.location.href = "/projectLead";
          break;
        case "designer":
          window.location.href = "/figmaRepository";
          break;
        case "admin":
          window.location.href = "/dashboard";
          break;
        default:
          window.location.href = "/";
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <ScoopedBackground>
      <header className="flex items-center justify-end px-3 sm:px-5 md:px-8 py-3 md:py-4 text-white">
        <button className="rounded-md px-3 py-1.5 text-sm text-white/85 hover:text-white transition">
          Login
        </button>
      </header>

      <main className="mx-auto grid h-[calc(100%-112px)] sm:h-[calc(100%-120px)] md:h-[calc(100%-136px)] max-w-6xl grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10 px-3 sm:px-5 md:px-8 pb-3">
        {/* Left Illustration */}
        <section className="flex items-center justify-center">
          <img
            src={illustration}
            alt="CRM Illustration"
            className="w-full max-w-[260px] sm:max-w-[360px] md:max-w-[480px] h-auto drop-shadow-2xl object-contain"
          />
        </section>

        {/* Right Login Card */}
        <section className="flex items-center md:justify-end">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-2xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Welcome Back...
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Please enter your email, password & select role
            </p>

            <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="sample@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="password Here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Login As
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="project lead">Project Lead</option>
                  <option value="designer">Designer</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="accounts">Accounts</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-1.5 w-full rounded-md bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-3 sm:px-5 md:px-8 pt-1 pb-3 sm:pb-4 md:pb-5 text-white">
        <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-white/80">
            <a className="hover:text-white" href="#">
              Privacy
            </a>
            <a className="hover:text-white" href="#">
              Terms
            </a>
            <a className="hover:text-white" href="#">
              Status
            </a>
          </div>
        </div>
      </footer>

      {/* Fixed Brand */}
      <div className="fixed left-[clamp(8px,2.5vw,20px)] bottom-[calc(env(safe-area-inset-bottom,0px)+clamp(8px,2.5vw,20px))] z-10 flex items-center gap-2 sm:gap-3 max-w-[92vw]">
        <img
          src={logo}
          alt="P5 Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl bg-white p-1 sm:p-1.5 md:p-2 shadow-md shrink-0"
        />
        <div className="leading-[1.05] min-w-0">
          <div className="font-extrabold text-[#4B1E7A] text-[clamp(16px,3.8vw,24px)] md:text-[24px] truncate">
            P5 CRM
          </div>
          <div className="font-medium text-[#6B3FA6] text-[clamp(11px,3vw,14px)] md:text-[14px] truncate">
            DIGITAL SOLUTIONS
          </div>
        </div>
      </div>
    </ScoopedBackground>
  );
};

export default Login;
