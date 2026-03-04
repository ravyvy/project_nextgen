import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CaretDownOutlined,
  BankOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Dropdown, Badge, Space } from "antd";
import { useCart } from "react-use-cart";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const handleLogout = () => {
    if (window.confirm('Do you want to logout? 🤷‍♀️')) {
      localStorage.removeItem("token");
      setIsLogin(true); // Should be false, but keeping original logic if intended
      // Wait, the original code had setIsLogin(false). Let's fix it.
      setIsLogin(false);
      navigate("/account/login");
    }
  };

  const items = isLogin
    ? [
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ]
    : [
      {
        key: 'register',
        label: <Link to="/account/register">Register</Link>,
        icon: <UserOutlined />,
      },
      {
        key: 'login',
        label: <Link to="/account/login">Login</Link>,
        icon: <UserOutlined />,
      },
    ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  return (
    <header className="sticky top-0 z-[1000] w-full transition-all duration-300">
      {/* Top Bar - Scrolling Text or Announcement */}
      <div className="bg-emerald-600 text-white py-1.5 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block px-4">
          <BankOutlined className="mr-2" />
          មានលក់កុំព្យូទ័រច្រើនប្រភេទ តម្លៃសមរម្យ មានគុណភាពល្អ និងមានការធានា — Best Prices in Cambodia — High Quality & Warranty
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="glass-effect border-b border-white/20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Brand Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://i.postimg.cc/fTSqrR8w/Screenshot-2026-01-24-125133.png"
                className="h-10 lg:h-12 w-auto object-contain transition-transform hover:scale-105"
                alt="Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: "Home", path: "/" },
                { name: "ROG", path: "/categories/Rog" },
                { name: "MSI", path: "/categories/Msi" },
                { name: "APPLE", path: "/categories/Apple" },
                { name: "Accessories", path: "/categories/Accessoris" },
                { name: "Chair", path: "/categories/chair" },
                { name: "PC Build", path: "/categories/CustomePcbuild" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-4 py-2 text-[15px] font-medium text-slate-700 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions: Search, Cart, Account */}
            <div className="flex items-center gap-3 lg:gap-6">
              {/* Desktop Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-slate-100 border-none rounded-full px-5 py-2 w-[150px] lg:w-[200px] text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                />
                <button type="submit" className="absolute right-3 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <SearchOutlined />
                </button>
              </form>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-slate-700 hover:text-emerald-600 transition-colors">
                <Badge count={totalItems} size="small" offset={[5, -5]} color="#10b981">
                  <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                </Badge>
              </Link>

              {/* Account Dropdown */}
              <Dropdown menu={{ items }} placement="bottomRight" arrow>
                <button className="flex items-center gap-2 p-2 px-3 rounded-full hover:bg-slate-100 transition-all text-slate-700">
                  <UserOutlined style={{ fontSize: '18px' }} />
                  <span className="hidden lg:inline text-sm font-medium">Account</span>
                  <CaretDownOutlined style={{ fontSize: '12px' }} />
                </button>
              </Dropdown>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[500px] border-t border-slate-100" : "max-h-0"}`}>
          <div className="px-4 py-6 bg-white space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 rounded-lg px-4 py-3 text-sm focus:bg-white border border-slate-100 outline-none"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchOutlined />
              </button>
            </form>

            <ul className="space-y-4 font-medium text-slate-700">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/categories/Rog" onClick={() => setMenuOpen(false)}>ROG</Link></li>
              <li><Link to="/categories/Msi" onClick={() => setMenuOpen(false)}>MSI</Link></li>
              <li><Link to="/categories/Apple" onClick={() => setMenuOpen(false)}>APPLE</Link></li>
              <li><Link to="/categories/Accessoris" onClick={() => setMenuOpen(false)}>Accessories</Link></li>
              <li><Link to="/categories/CustomePcbuild" onClick={() => setMenuOpen(false)}>PC Build</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
