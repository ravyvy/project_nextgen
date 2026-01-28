import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./footer";
import { useCart } from "react-use-cart";

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
        const response = await axios.get("http://localhost:9000/getall");
        const apiData = response.data.data || [];

        // Flatten products and normalize image field
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
                  img: child.image || item.img || null, // 🔥 normalize image
                  category: item.name || "",            // add category for search
                });
              });
            } else {
              result.push({
                id: item.id,
                title: item.title,
                price: item.price,
                description: item.description,
                brand: item.brand,
                img: item.img || item.image || null, // 🔥 normalize image
                category: item.name || "",
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

  // Filter by title OR category
  const filtered = products.filter((item) =>
    `${item.title} ${item.category}`.toLowerCase().includes(query)
  );

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto mt-10">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="w-[300px] bg-white shadow p-3 rounded"
              >
                {/* Image (with fallback if missing) */}
                <Link to={`/categories/details/${item.id}`}>
                  <img
                    src={`http://localhost:9000/images/${item.img}`}
                    alt={item.title}
                    className="w-full h-[300px] object-contain"
                  />
                  {item.stock && (
                    <h3
                      className={`inline p-1 ms-3 rounded-sm ${item.stock === "in stock"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        }`}
                    >
                      {item.stock}
                    </h3>
                  )}
                  <h2 className="text-gray-600 m-3">{item.title}</h2>
                  {item.price && (
                    <h1 className="text-black font-bold m-3">${item.price}</h1>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
