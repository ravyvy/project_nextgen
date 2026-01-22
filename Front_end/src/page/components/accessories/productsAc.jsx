// src/pages/ProductsAc.jsx
import React from 'react';
import { useParams, Link } from "react-router-dom";
import Navbar from '../navbar';
import SliderProduct from "../products/sliderProducts";
import Slider from "../slider";
import Footer from "../footer";
import { accessories } from "../products/datas";

const ProductsAc = () => {
  const { name } = useParams();

  // Find category
  const category = accessories.find(
    item => item.name.toLowerCase() === name.toLowerCase()
  );

  return (
    <>
      <Navbar />
      <Slider />
      <SliderProduct />

      <div className='max-w-[1300px] mx-auto mt-10 mb-10'>
        
        <h1 className="text-center font-bold text-[30px] uppercase">
          {category ? category.title : name} CATEGORY
        </h1>
        <hr className="border border-gray-300 mb-10" />

        <div className="flex flex-wrap gap-10 justify-center">

          {/* Safe check for category + products */}
          {category && category.products && category.products.length > 0 ? (
            category.products.map(product => (
              <Link
                key={product.id}
                to={`/categories/details/${product.id}`}
                className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:scale-105 duration-200"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-[200px] h-[150px] mx-auto"
                />
                <p className="text-xl text-center mt-2">{product.title}</p>
              </Link>
            ))
          ) : (
            <p className="text-center text-red-500 text-xl">
              No products found for "{name}"
            </p>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};
export default ProductsAc;
