import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Không tìm thấy trang</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          <Home className="size-5" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
