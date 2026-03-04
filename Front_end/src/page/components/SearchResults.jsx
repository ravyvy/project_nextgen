import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./footer";
import { useCart } from "react-use-cart";
import { SearchOutlined, ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Breadcrumb, Empty, Skeleton } from "antd";

const SearchResults = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];

        const flattenProducts = (data) => {
          let result = [];
          data.forEach((item) => {
            if (Array.isArray(item.products) && item.products.length > 0) {
              item.products.forEach((child) => {
                result.push({
                  id: child.id,
                  title: child.title,
                  price: child.price,
                  description: child.description,
                  brand: child.brand,
                  img: child.image || item.img || null,
                  category: item.name || "",
                  stock: child.stock || item.stock
                });
              });
            } else {
              result.push({
                id: item.id,
                title: item.title,
                price: item.price,
                description: item.description,
                brand: item.brand,
                img: item.img || item.image || null,
                category: item.name || "",
                stock: item.stock
              });
            }
          });
          return result;
        };

        setProducts(flattenProducts(apiData));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((item) =>
    `${item.title} ${item.category}`.toLowerCase().includes(query)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
        <Navbar />
        <div className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-slate-200 rounded-2xl w-2/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-200 rounded-[2rem]"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-12">
        <div className="mb-12">
          <Breadcrumb
            className="mb-4 text-xs uppercase font-bold tracking-widest transition-opacity"
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <span className="text-emerald-600 font-bold">Search</span> },
              { title: <span className="text-slate-400 font-bold uppercase">"{query}"</span> },
            ]}
          />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-emerald-600 border border-slate-100 transform hover:rotate-6 transition-transform">
                <SearchOutlined style={{ fontSize: '28px' }} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-outfit uppercase leading-tight">
                  Search <span className="text-emerald-500">Results</span>
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  {filtered.length} products found for <span className="text-emerald-600 font-bold italic">"{query}"</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 flex justify-center bg-white rounded-[2.5rem] premium-shadow border border-slate-100">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-4 text-center">
                  <p className="text-xl font-bold text-slate-700">No matches found</p>
                  <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any products matching your search. Try different keywords or browse our categories.</p>
                  <Link to="/" className="inline-block mt-4 text-emerald-600 font-black uppercase tracking-widest text-sm hover:underline">Return Home</Link>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] overflow-hidden premium-shadow border border-slate-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
              >
                {/* Image Section */}
                <Link to={`/categories/details/${item.id}`} className="relative h-64 bg-slate-50 overflow-hidden flex items-center justify-center p-8">
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                    alt={item.title}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Stock Badge */}
                  {item.stock && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${item.stock === "in stock" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        }`}>
                        {item.stock}
                      </span>
                    </div>
                  )}

                  {/* Overly Overlay */}
                  <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-emerald-600 font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Details
                    </div>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <ThunderboltOutlined className="text-emerald-500 text-xs" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest capitalize">{item.category}</span>
                  </div>
                  <Link to={`/categories/details/${item.id}`}>
                    <h2 className="text-slate-800 font-bold text-lg mb-3 line-clamp-2 hover:text-emerald-600 transition-colors h-14">
                      {item.title}
                    </h2>
                  </Link>

                  {/* Action Section */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Price</span>
                      <span className="text-2xl font-black text-slate-900">${item.price || 0}</span>
                    </div>
                    <Link to={`/categories/details/${item.id}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 group-hover:bg-emerald-600">
                      <ShoppingCartOutlined />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
