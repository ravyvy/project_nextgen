import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";

const ProductsLattop = () => {
  const categories = ["asus", "apple", "dell", "msi"];
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://project-nextgen-1dnjds.onrender.com/getall")
      .then((response) => {
        const productsArray = response.data.data;
        const groupedSections = categories.map((category) => {
          const products = productsArray
            .filter((item) => item.name.toLowerCase() === category.toLowerCase())
            .slice(0, 8);
          return { title: category, products };
        });
        setSections(groupedSections);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading premium choice...</p>
    </div>
  );

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-10 py-12">
      {sections.map((section, index) => (
        section.products.length > 0 && (
          <div key={index} className="mb-16">
            {/* Title section */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-slate-900 font-extrabold text-3xl lg:text-4xl capitalize mb-2">
                  {section.title} <span className="text-emerald-500">Collection</span>
                </h2>
                <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
              </div>
              <Link
                to={`/categories/${section.title}`}
                className="group flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors"
              >
                VIEW ALL <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.products.map((item) => (
                <div
                  key={item.id}
                  className="premium-card bg-white rounded-3xl overflow-hidden border border-slate-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square p-6 bg-slate-50 group">
                    {item.dis && (
                      <span className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {item.dis} OFF
                      </span>
                    )}
                    <Link to={`/categories/details/${item.id}`} className="block h-full">
                      <img
                        src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                        alt={item.title}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>

                    {/* Floating Quick Add (Optional visual) */}
                    <button className="absolute bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      {item.stock && (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${item.stock === "in stock" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>
                          {item.stock}
                        </span>
                      )}
                    </div>

                    <Link to={`/categories/details/${item.id}`} className="block group">
                      <h3 className="text-slate-800 font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                      <span className="text-2xl font-black text-slate-900">
                        ${item.price}
                      </span>
                      <Link
                        to={`/categories/details/${item.id}`}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </section>
  );
};

export default ProductsLattop;
