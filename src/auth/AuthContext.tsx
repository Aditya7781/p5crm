// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, meRequest, Role } from "../api/client";

type AuthState = {
  token: string | null;
  role: Role | null;
  user: { id: string; name: string; email: string } | null;
};

type AuthContextValue = {
  token: string | null;
  role: Role | null;
  user: AuthState["user"];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // bootstrap session
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);
      try {
        const me = await meRequest(token);
        setState({
          token,
          role: me.role,
          user: { id: me.id, name: me.name, email: me.email },
        });
      } catch {
        localStorage.removeItem("token");
        setState({ token: null, role: null, user: null });
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user } = await loginRequest(email, password);
      localStorage.setItem("token", token);
      setState({
        token,
        role: user.role,
        user: { id: user.id, name: user.name, email: user.email },
      });
      // route by role
      if (user.role === "admin") navigate("/dashboard", { replace: true });
      else if (user.role === "staff") navigate("/projects", { replace: true });
      else navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ token: null, role: null, user: null });
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      token: state.token,
      role: state.role,
      user: state.user,
      login,
      logout,
      loading,
    }),
    [state, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
