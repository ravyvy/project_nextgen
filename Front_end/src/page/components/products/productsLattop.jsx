import React from "react";
import { Link } from "react-router-dom";
import { accessories } from "./datas";

const ProductsLattop = () => {
  // ប្រភេទដែលចង់បង្ហាញ
  const categories = ["lattop", "apple", "dell"];

  // បង្កើត sections តាម category
  const sections = categories.map(category => {
    const products = accessories.filter(item => item.name === category);
    return { title: category, products };
  });
  return (
    <div className="max-w-[1300px] mx-auto mt-10">
      {sections.map((section, index) => (
        <div key={index} className="mb-10">
          {/* Title section */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-black font-bold text-3xl">{section.title}</h1>
            <button className="bg-red-600 text-white p-2 rounded-sm">
              SHOW MORE
            </button>
          </div>
          <hr className="border border-gray-300 mb-6" />

          <div className="flex gap-6 flex-wrap justify-center">
            {section.products.map(item => (
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
                    className="w-full h-[300px] object-contain "
                  />
                  {item.stock && (
                    <h3
                      className={`inline p-1 ms-3 rounded-sm ${item.stock === "In stock"
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
