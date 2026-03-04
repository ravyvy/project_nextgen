import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductsLattop = () => {
  const categories = ["asus", "apple", "dell", "msi"];
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://project-nextgen-1dnjds.onrender.com/getall")
      .then((response) => {
        const productsArray = response.data.data; // <-- fix here
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

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-[1300px]  mx-auto mt-10">
      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          {/* Title section */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-black font-bold text-3xl">{section.title}</h1>
            <Link
              to={`/categories/${section.title}`}
              className="bg-red-600 text-white p-2 rounded-sm"
            >
              SHOW MORE
            </Link>
          </div>

          <hr className="border border-gray-300 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.products.map((item) => (
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
                    className="w-full h-[300px] object-contain transition-transform duration-300 ease-in-out hover:opacity-60"
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
        </div>
      ))}
    </div>
  );
};

export default ProductsLattop;
