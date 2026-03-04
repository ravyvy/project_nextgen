// src/pages/ProductsAc.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../navbar';
import SliderProduct from "../products/sliderProducts";
import Slider from "../slider";
import Footer from "../footer";

const ProductsAc = () => {
  const { name } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall"); // get all categories
        const data = res.data?.data || [];

        // Find the category matching the route param
        const matchedCategory = data.find(
          (item) => item.name.toLowerCase() === name.toLowerCase()
        );

        setCategory(matchedCategory || null);
      } catch (error) {
        console.error("Error fetching category:", error);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [name]);

  if (loading) {
    return (
      <>
        <Navbar />
        {/* <Slider />
        <SliderProduct /> */}
        <p className="text-center mt-20 text-gray-500">Loading products...</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* <Slider />
      <SliderProduct /> */}

      <div className='max-w-[1300px] mx-auto mt-10 mb-10'>
        
        <h1 className="text-center font-bold text-[30px] uppercase">
          {category ? category.title : name} 
        </h1>
        <hr className="border border-gray-300 mb-10" />

        <div className="flex flex-wrap gap-10 justify-center">

          {category && category.products && category.products.length > 0 ? (
            category.products.map(product => (
              <Link
                key={product.id}
                to={`/categories/details/${product.id}`}
                className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:scale-105 duration-200"
              >
                <img
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${product.img || product.image}`}
                  alt={product.title || product.name}
                  className="w-[200px] h-[150px] mx-auto object-contain"
                />
                <p className="text-xl text-center mt-2">{product.title || product.name}</p>
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
