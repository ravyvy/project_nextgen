import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 12;

const Chair = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];

        // 🔥 Flatten and normalize image field
        const chairProducts = [];
        apiData.forEach((item) => {
          if (item.name?.toLowerCase() === "chair") {
            // If category has products array
            if (Array.isArray(item.products) && item.products.length > 0) {
              item.products.forEach((child) => {
                chairProducts.push({
                  id: child.id,
                  title: child.title,
                  price: child.price,
                  stock: child.stock,
                  dis: child.dis,
                  img: child.image || item.img || null,
                });
              });
            } else {
              // No child products
              chairProducts.push({
                id: item.id,
                title: item.title,
                price: item.price,
                stock: item.stock,
                dis: item.dis,
                img: item.img || item.image || null,
              });
            }
          }
        });

        setProducts(chairProducts);
      } catch (err) {
        console.error("Error fetching chair products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <p className="text-center mt-20">Loading Chair products...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-[1300px] mx-auto mt-10">
        <h1 className="text-black font-bold text-3xl mb-4">CHAIR PRODUCTS</h1>
        <hr className="border border-gray-300 mb-6" />

        {/* PRODUCT LIST */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md w-full rounded-sm relative"
            >
              {item.dis && (
                <p className="bg-red-500 w-[120px] ps-2 rounded-br-lg rounded-tl-lg font-bold text-white">
                  {item.dis}
                </p>
              )}

              <Link to={`/categories/details/${item.id}`}>
                <img
                  src={
                    item.img
                      ? `https://project-nextgen-1dnjds.onrender.com/images/${item.img}`
                      : "/no-image.png"
                  }
                  alt={item.title}
                  className="w-full h-[300px] object-contain"
                />

                {item.stock && (
                  <h3
                    className={`inline p-1 ms-3 rounded-sm ${
                      item.stock === "in stock"
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

        {/* PAGINATION */}
        <div className="flex justify-center mt-10 mb-10">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={products.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chair;
