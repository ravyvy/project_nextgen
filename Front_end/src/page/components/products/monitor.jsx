import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import SliderProduct from "../products/sliderProducts";
import Slider from "../slider";
import Footer from "../footer";
import { Link } from "react-router-dom";
import axios from "axios";

const Accessori = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        setAccessories(res.data?.data || []);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter categories to show
  const categories = accessories.filter(item =>
    ["monitormsi", "monitorapple", "monitordell", "monitorrog"].includes(item.name)
  );

  // Find categories
  const msiCategory = accessories.find(item => item.name === "monitormsi");
  const appleCategory = accessories.find(item => item.name === "monitorapple");
  const dellCategory = accessories.find(item => item.name === "monitordell");
  const rogCategory = accessories.find(item => item.name === "monitorrog");

  const msiProducts = msiCategory?.products || [];
  const appleProducts = appleCategory?.products || [];
  const dellProducts = dellCategory?.products || [];
  const rogProducts = rogCategory?.products || [];

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <Slider />
      <SliderProduct />

      <div className="max-w-[1300px] mx-auto mt-10 mb-10">
        {/* Categories Grid */}
        <h1 className="text-center font-bold mt-[50px] text-[30px]">
          CATEGORIES
        </h1>
        <hr className="border border-gray-300 mb-10" />

        <div className="flex flex-wrap lg:gap-1 gap-10 justify-center lg:justify-between md:justify-center items-center">
          {categories.map(item => (
            <div key={item.id} className="bg-white shadow-sm lg:w-[24%] block">
              <Link to={`/categories/Accessoris/${item.name}`}>
                <img

                  src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                  alt={item.title}
                  className="w-[200px] h-40 mx-auto"
                />
                <p className="text-xl text-center mt-2">{item.title}</p>
              </Link>
            </div>
          ))}
        </div>

        {/* MSI */}
        {msiProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {msiCategory.title}  
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {msiProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-full rounded-lg"
                >
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${msiCategory.img}`}
                    alt={product.title}
                    className="w-full h-40 object-contain"
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

        {/* APPLE */}
        {appleProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {appleCategory.title}  
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {appleProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-full rounded-lg"
                >
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${appleCategory.img}`}
                    alt={product.title}
                    className="w-full h-40 object-contain"
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

        {/* DELL */}
        {dellProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {dellCategory.title}  
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dellProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-full rounded-lg"
                >
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${dellCategory.img}`}
                    alt={product.title}
                    className="w-full h-40 object-contain"
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

        {/* ROG */}
        {rogProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {rogCategory.title}  
            </h2>
            <hr className="border border-gray-300 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {rogProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-full rounded-lg"
                >
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${rogCategory.img}`}
                    alt={product.title}
                    className="w-full h-40 object-contain"

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
      </div>

      <Footer />
    </>
  );
};

export default Accessori;
