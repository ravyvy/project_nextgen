import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { Pagination } from 'antd';
import { Link } from "react-router-dom";
import axios from 'axios';

const PAGE_SIZE = 12;

const Asus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ASUS products from API
  useEffect(() => {
    axios
      .get('https://project-nextgen-1dnjds.onrender.com/getall') // replace with your API endpoint
      .then((res) => {
        const apiData = res.data.data;

        // Filter ASUS products
        const asusProducts = apiData.filter(item => item.name === "asus");

        // Flatten nested products if needed
        const flattened = asusProducts.flatMap(item => 
          item.products && item.products.length > 0
            ? item.products.map(p => ({
                id: p.id,
                title: p.title,
                img: p.img || item.img, // fallback if product.img is missing
                price: p.price,
                stock: p.stock,
                dis: p.dis,
              }))
            : [{
                id: item.id,
                title: item.title,
                img: item.img,
                price: item.price,
                stock: item.stock,
                dis: item.dis,
              }]
        );

        setProducts(flattened);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ASUS products:", err);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Pagination slice
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = products.slice(startIndex, endIndex);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-gray-500">Loading ASUS products...</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-[1300px] mx-auto mt-10">
        <h1 className="text-black font-bold text-3xl mb-4">ASUS PRODUCTS</h1>
        <hr className="border border-gray-300 mb-6" />

        {/* PRODUCT LIST */}
        <div className="flex gap-6 flex-wrap justify-center">
          {currentProducts.map(item => (
            <div
              key={item.id}
              className="bg-white shadow-md w-[300px] rounded-sm relative"
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
            total={products.length}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Asus;
