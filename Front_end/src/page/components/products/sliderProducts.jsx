import React from "react";
import { laptops } from "../data";
import { Link } from "react-router-dom";

const SliderProducts = () => {
    // Filter only products with id 1 to 5
    const visibleLaptops = laptops.filter(item => item.id >= 101 && item.id <= 105);

    return (
        <div className="max-w-[1300px] mx-auto mb-5">
            <h1 className="text-center font-bold mt-[50px] text-[30px]">Hot Promotion</h1>
            <hr className="border border-gray-300 mb-10" />

            <div className="overflow-x-auto whitespace-nowrap p-3 pb-5">
                <div className="flex gap-9 items-center">
                    
                    {visibleLaptops.map((item) => (
                        
                        <Link
                            to={`/categories/details/${item.id}`}
                            key={item.id}
                            className="bg-white shadow-md w-[300px] h-auto rounded-sm whitespace-normal shrink-0 hover:scale-105 transition"
                        >
                             {item.dis && (
                  <p className="bg-green-500 w-20 ps-5 rounded-br-lg rounded-tl-lg font-bold text-white">
                    {item.dis}
                  </p>
                )}
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-[300px] object-contain"
                            />
                            <h3
                                className={`inline p-1 ms-3 rounded-sm ${
                                    item.stock === "In stock"
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                }`}
                            >
                                {item.stock}
                            </h3>
                            <h2 className="text-gray-600 m-3">{item.title}</h2>
                            <h1 className="text-black font-bold m-3">${item.price}</h1>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SliderProducts;
