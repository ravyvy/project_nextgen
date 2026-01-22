import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { accessories } from "./products/datas";
import Navbar from "./navbar";
import Footer from "./footer";
import { useCart } from "react-use-cart";

const SearchResults = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  const flattenProducts = (data) => {
    let result = [];
    data.forEach((item) => {
      if (Array.isArray(item.products)) {
        item.products.forEach((child) => {
          result.push({
            id: child.id,
            title: child.title,
            img: child.img,
            price: child.price,
            description: child.description,
            brand: child.brand,
          });
        });
      } else {
        result.push({
          id: item.id,
          title: item.title,
          img: item.img,
          price: item.price,
          description: item.description,
          brand: item.brand,
        });
      }
    });
    return result;
  };

  const allProducts = flattenProducts(accessories);

  const filtered = allProducts.filter((item) =>
    (item.title || "").toLowerCase().includes(query)
  );

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto mt-10">

        <div className="flex flex-wrap gap-6 justify-center">
          {filtered.map((item) => (
            <div key={item.id} className="w-[300px] bg-white shadow p-3 rounded">

              <img
                src={item.img}
                className="w-full h-[250px] object-contain"
                alt={item.title}
              />

              <h2 className="font-bold mt-2">{item.title}</h2>
              <p className="text-green-600 font-bold">${item.price}</p>

              {/* 🔥 Add to Cart Button */}
              <button
                className="bg-blue-600 text-white w-full py-2 rounded mt-3 hover:bg-blue-700"
                onClick={() => addItem(item)}
              >
                Add to Cart
              </button>

            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
