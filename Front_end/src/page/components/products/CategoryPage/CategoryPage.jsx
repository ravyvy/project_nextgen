import React from "react";
import { useParams } from "react-router-dom";
import { accessories } from "../datas";
import { Link } from "react-router-dom";
import Navbar  from "../../navbar";
import Footer from '../../footer'
const CategoryPage = () => {
  const { categoryName } = useParams(); // grab "asus", "dell", etc from URL

  // filter products by category
  const products = accessories.filter(item => item.name === categoryName);

  return (
   <>
   <Navbar/>
    <div className="max-w-[1300px] mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
      <div className="flex gap-6 flex-wrap justify-center">
        {products.map(item => (
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
                <h1 className="text-black font-bold m-3">${item.price}</h1>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};


export default CategoryPage;
