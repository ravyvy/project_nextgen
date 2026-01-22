import React, { useState } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { Pagination } from 'antd';
import { Link } from "react-router-dom";
import { accessories } from "./datas";   // make sure path is correct

const PAGE_SIZE = 8;

const asus = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter only ROG products
  const rogProducts = accessories.filter(item => item.name === "asus");

  // 2. Slice products by pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = rogProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[300px] object-contain"
                />

                {item.stock && (
                  <h3
                    className={`inline p-1 ms-3 rounded-sm ${
                      item.stock === "In stock"
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
      <Footer/>
    </>
  );
};

export default asus;
