import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { GraduationCap, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../utils/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl mb-4">
            <GraduationCap className="size-8 text-white" />
          </div>
          <h1 className="text-3xl text-blue-700">Hành Trang Số</h1>
          <p className="text-gray-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user hoặc premium"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              <LogIn className="size-5" />
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 space-y-1">
            <p className="font-medium text-gray-600 mb-2">Tài khoản demo:</p>
            <p>👤 <span className="font-mono">user</span> / <span className="font-mono">user123</span> — Tài khoản thường</p>
            <p>⭐ <span className="font-mono">premium</span> / <span className="font-mono">premium123</span> — Tài khoản Premium</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
