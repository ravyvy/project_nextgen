import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 12;

const Rog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rogProducts, setRogProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://project-nextgen-1dnjds.onrender.com/getall")
      .then((res) => {
        const data = res.data.data || [];

        // 🔥 filter only ROG products
        const rogOnly = data.filter(
          (item) => item.name?.toLowerCase() === "msi"
        );

        setRogProducts(rogOnly);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ROG products:", err);
        setLoading(false);
      });
  }, []);

  // Pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = rogProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <p className="text-center mt-20">Loading ROG products...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-[1300px] mx-auto mt-10">
        <h1 className="text-black font-bold text-3xl mb-4">ROG PRODUCTS</h1>
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
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
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
                  <h1 className="text-black font-bold m-3">
                    ${item.price}
                  </h1>
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
            total={rogProducts.length}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Rog;
