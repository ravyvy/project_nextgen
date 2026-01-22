import React from 'react';
import Navbar from '../navbar';
import SliderProduct from "../products/sliderProducts";
import Slider from "../slider";
import Footer from "../footer";
import { Link } from "react-router-dom";
import { accessories } from '../products/datas';

const Accessori = () => {
  // Filter categories to show
  const categories = accessories.filter(item =>
    ["mouse", "keyboard", "stream", "headset", "mousepad", "office", "razer", "game"].includes(item.name)
  );

  // Find mouse and keyboard categories
  const mouseCategory = accessories.find(item => item.name === "mouse");
  const keyboardCategory = accessories.find(item => item.name === "keyboard");
  const streamCategory = accessories.find(item => item.name === "stream");

  const mouseProducts = mouseCategory?.products || [];
  const keyboardProducts = keyboardCategory?.products || [];
  const StreamProducts = streamCategory?.products || [];

  return (
    <>
      <Navbar />
      <Slider />
      <SliderProduct />

      <div className='max-w-[1300px] mx-auto mt-10 mb-10'>
        {/* Categories Grid */}
        <h1 className="text-center font-bold mt-[50px] text-[30px]">CATEGORIES</h1>
        <hr className="border border-gray-300 mb-10" />

        <div className='flex flex-wrap lg:gap-1 gap-10 justify-center lg:justify-between md:justify-center items-center'>
          {categories.map(item => (
            <div key={item.id} className='bg-white shadow-sm lg:w-[24%] block'>
              <Link to={`/categories/Accessoris/${item.name}`}>
                <img
                  src={item.img}
                  alt={item.title}
                  className='w-[200px] h-40 mx-auto'
                />
                <p className='text-xl text-center mt-2'>{item.title}</p>
              </Link>
            </div>
          ))}
        </div>

        {/* Mouse Products Section */}
        {mouseProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">{mouseCategory.title} PRODUCTS</h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {mouseProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-[200px] h-[150px] mx-auto"
                  />
                  <p className="text-xl text-center mt-2">{product.title}</p>
                  {product.price && (
                    <p className="text-lg font-bold text-black text-center mt-1">
                      ${product.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}


        {/* Keyboard Products Section */}
        {keyboardProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">{keyboardCategory.title} PRODUCTS</h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {keyboardProducts.map(product => (
                 <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-[200px] h-[150px] mx-auto"
                  />
                  <p className="text-xl text-center mt-2">{product.title}</p>
                  {product.price && (
                    <p className="text-lg font-bold text-black text-center mt-1">${product.price}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* stream */}
        {StreamProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">{streamCategory.title} PRODUCTS</h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {StreamProducts.map(product => (
                 <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-[200px] h-[150px] mx-auto"
                  />
                  <p className="text-xl text-center mt-2">{product.title}</p>
                  {product.price && (
                    <p className="text-lg font-bold text-black text-center mt-1">${product.price}</p>
                  )}
               </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Accessori;
