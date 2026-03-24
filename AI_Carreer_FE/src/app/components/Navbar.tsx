import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronDown, LogOut, Crown, User, LogIn, Phone, Mail, Search } from "lucide-react";
import { useAuth } from "../utils/useAuth";

type NavItemConfig = {
  label: string;
  to?: string;
  items?: (string | { label: string; to: string })[];
};

const navItems: NavItemConfig[] = [
  { label: "Trang chủ", to: "/" },
  {
    label: "Giới thiệu",
    items: [
      "Giới thiệu về Hành Trang Số",
      "Hành trình lan tỏa giá trị",
      "Quy trình hướng nghiệp",
      "Sự khác biệt tạo nên điều đặc biệt",
    ],
  },
  {
    label: "Hệ thống bài test",
    items: [
      { label: "Kiểm tra tính cách", to: "/mbti-test" },
      { label: "Kiểm tra đa trí thông minh", to: "/intel-test" },
      { label: "Kiểm tra mật mã Holland", to: "/holland-test" },
      { label: "Kiểm tra năng lực", to: "/ability" },
      { label: "Kiểm tra tính cách D.I.S.C", to: "/disc-test" },
    ],
  },
  { label: "Các trường đại học", to:"/universities" },
  // {
  //   label: "Tài liệu",
  //   items: [
  //     "Tìm Hiểu Ngành Nghề",
  //     "Người nổi tiếng + Gương sáng học sinh",
  //     "Thông tin doanh nghiệp",
  //     "Hệ thống các đơn vị đào tạo",
  //     "Giới thiệu các nhóm tính cách",
  //     "Giới thiệu các loại hình thông minh",
  //     "Xu hướng phát triển ngành nghề theo thời kỳ 4.0",
  //   ],
  // },
  // {
  //   label: "Khóa học",
  //   items: [
  //     "Định Vị Bản Thân",
  //     "Hướng Nghiệp",
  //     "Thuyết Trình Đỉnh Cao",
  //     "Teamwork Đỉnh Cao",
  //     "Làm Chủ Cảm Xúc",
  //     "Quản Lý Thời Gian",
  //     "Khóa học tổng hợp",
  //   ],
  // },
  // { label: "Tư liệu môn học" },
  // { label: "Đăng ký tư vấn" },
  // {
  //   label: "Tin tức",
  //   items: ["Tin hoạt động", "Hình ảnh", "Video"],
  // },
  // {
  //   label: "Hỗ trợ",
  //   items: ["Hướng dẫn sử dụng", "Câu hỏi thường gặp", "Gói cước sử dụng", "Đăng ký tư vấn", "Học bổng Spro+"],
  // },
];

function TopNavItem({ item, isActive }: { item: NavItemConfig; isActive: (path: string) => boolean }) {
  const hasDropdown = Boolean(item.items?.length);
  const active = item.to ? isActive(item.to) : false;
  const baseClasses =
    "inline-flex items-center gap-1.5 px-3 py-2 text-[15px] transition-colors rounded-sm whitespace-nowrap";
  const stateClasses = active
    ? "bg-orange-500 text-white"
    : "text-slate-900 hover:bg-orange-500 hover:text-white";

  return (
    <div className="relative group">
      {item.to && !hasDropdown ? (
        <Link to={item.to} className={`${baseClasses} ${stateClasses}`}>
          {item.label}
        </Link>
      ) : (
        <button type="button" className={`${baseClasses} ${stateClasses}`}>
          <span>{item.label}</span>
          {hasDropdown && <ChevronDown className="size-4" />}
        </button>
      )}

      {hasDropdown && (
        <div className="absolute left-0 top-full z-[60] hidden min-w-[260px] rounded-sm border border-slate-200 bg-white py-2 shadow-lg group-hover:block">
          {item.items?.map((entry) => {
            const isString = typeof entry === "string";
            const label = isString ? (entry as string) : (entry as { label: string }).label;
            const to = isString ? undefined : (entry as { to: string }).to;

            if (to) {
              return (
                <Link
                  key={label}
                  to={to}
                  className="block w-full px-4 py-2 text-left text-[14px] text-slate-700 hover:bg-slate-100"
                >
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={label}
                type="button"
                className="block w-full px-4 py-2 text-left text-[14px] text-slate-700 hover:bg-slate-100"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-3">
            <div className="flex flex-1 flex-col gap-1 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                <Phone className="size-4" />
                <span>0123.456.789</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="size-4" />
                <span>hotro.hanhtrangso@gmail.com</span>
              </div>
            </div>

            <Link to="/" className="flex flex-1 items-center justify-center">
              <img src="/logo.png" alt="Novaedu" className="h-[160px] object-contain" />
            </Link>

            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="flex items-center border border-slate-300">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-56 px-3 py-2 text-sm outline-none"
                />
                <button type="button" className="px-3 py-2 text-slate-600">
                  <Search className="size-4" />
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  {user?.isPremium ? (
                    <Crown className="size-4 text-orange-500" />
                  ) : (
                    <User className="size-4 text-slate-400" />
                  )}
                  <span>{user?.displayName}</span>
                  <Link
                    to="/profile"
                    className="ml-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-orange-300 hover:text-orange-600"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Đăng xuất"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700">
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <TopNavItem item={item} isActive={isActive} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
