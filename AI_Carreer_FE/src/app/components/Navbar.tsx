import { Link, useLocation, useNavigate } from "react-router";
import { GraduationCap, LayoutDashboard, School, Map, Sparkles, LogOut, Crown, User } from "lucide-react";
import { useAuth } from "../utils/useAuth";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-orange-600">CareerPath AI</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/results"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/results") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Tổng quan</span>
            </Link>

            <Link
              to="/universities"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/universities") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <School className="size-4" />
              <span>Trường đại học</span>
            </Link>

            <Link
              to="/roadmap"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/roadmap") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Map className="size-4" />
              <span>Lộ trình</span>
            </Link>

            <Link
              to="/assessment"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg transition-all"
            >
              <Sparkles className="size-4" />
              <span>Bắt đầu đánh giá</span>
            </Link>

            {/* User info */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                {user?.isPremium ? (
                  <Crown className="size-4 text-orange-500" />
                ) : (
                  <User className="size-4 text-gray-400" />
                )}
                <span>{user?.displayName}</span>
                {user?.isPremium && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">Premium</span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Đăng xuất"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
