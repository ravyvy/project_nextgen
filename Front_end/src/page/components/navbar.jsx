import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaretDownOutlined, BankOutlined } from "@ant-design/icons";
// catd
import { useCart } from "react-use-cart";
const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);

  // cart
  const { totalItems } = useCart();
  // end
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();


  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const handleLogout = () => {
    if (window.confirm('Do you want logout ? 🤷‍♀️')) {
      localStorage.removeItem("token");
      setIsLogin(false);
      navigate("/account/login");
    }
  };
  const handleAuthChange = (e) => {
    const value = e.target.value;

    if (value === "logout") {
      handleLogout();
    } else if (value !== "") {
      navigate(value);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  return (
    <nav className="bg-black text-white shadow-xl/20 z-100 mb-3">
      <div className="lg:ms-35 lg:me-35">
        <div className="w-full mx-auto flex flex-wrap items-center justify-between p-4">

          {/* Brand logo */}
          <img
            src="https://i.postimg.cc/fTSqrR8w/Screenshot-2026-01-24-125133.png"
            className="w-35 h-15 object-contian"
            alt="Logo"
          />
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-white cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Menu Items */}
          <div className={`w-full lg:flex lg:items-center lg:w-auto ${menuOpen ? "block" : "hidden"}`}>
            <ul className="lg:flex mt-2 lg:mt-0">
              {/* Main menu links */}
              <li><Link to="/" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">Home</Link></li>
              <li><Link to="/categories/Rog" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">ROG</Link></li>
              <li><Link to="/categories/Msi" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">MSI</Link></li>
              {/* <li><Link to="/categories/Asus" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">ASUS</Link></li> */}
              <li><Link to="/categories/Apple" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">APPLE</Link></li>
              <li><Link to="/categories/Accessoris" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">Accessories</Link></li>
              <li><Link to="/categories/Monitor" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">Monitor</Link></li>
              <li><Link to="/categories/Chair" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">Chair</Link></li>
              <li><Link to="/categories/CustomePcbuild" className="block py-2 px-4 hover:bg-gray-800 rounded text-[17px]">Custom PC Builds</Link></li>
            </ul>
            <div className="flex gap-5">
              <select
                onChange={handleAuthChange}
                className="bg-gray-800 text-white text-xl py-1 px-1 rounded border border-gray-600 cursor-pointer outline-none focus:border-blue-400"
                defaultValue=""
              >
                <option value="" disabled>Account</option>
                {isLogin ? (
                  <option value="logout">Logout</option>
                ) : (
                  <>
                    <option value="/account/register" className="cursor-pointer">Register</option>
                    <option value="/account/login">Login</option>
                  </>
                )}
              </select>
            </div>
          </div>


        </div>
      </div>

      {/* Bottom bar with Search */}
      <div className="lg:bg-white">
        <div className="max-w-[1300px] mx-auto py-3 flex lg:justify-between justify-center items-center flex-wrap gap-5">

          <h1 className="text-center text-md font-bold leading-6 text-white lg:text-black max-w-[900px]">
            <BankOutlined style={{ fontSize: "28px", color: "green" }} />
            &nbsp; មានលក់កុំព្យូទ័រច្រើនប្រភេទ តម្លៃសមរម្យ មានគុណភាពល្អ និងមានការធានា
          </h1>

          {/* SEARCH BAR (WORKS GLOBALLY) */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-gray-300 rounded-lg text-black bg-white px-3 py-2 lg:w-[350px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
            >
              Search
            </button>
            <div className="">
              <Link to="/cart" className="relative">
                🛒
                <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 rounded-full text-sm">
                  {totalItems}
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
