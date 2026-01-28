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
    const fetchAccessories = async () => {
      try {
        const res = await axios.get("http://localhost:9000/getall");
        setAccessories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // Filter categories to show (only these names)
  const categories = accessories.filter(item =>
    ["mouse", "keyboard", "stream", "headset", "mousepad", "office", "razer", "game"]
      .includes(item?.name?.toLowerCase())
  );

  // Find specific categories by name
  const mouseCategory    = accessories.find(item => item?.name?.toLowerCase() === "mouse");
  const keyboardCategory = accessories.find(item => item?.name?.toLowerCase() === "keyboard");
  const streamCategory   = accessories.find(item => item?.name?.toLowerCase() === "stream");
  const headsetCategory  = accessories.find(item => item?.name?.toLowerCase() === "headset");

  // Extract products arrays with safe defaults + limit to first 4
  const mouseProducts    = mouseCategory?.products?.slice(0, 4)    || [];
  const keyboardProducts = keyboardCategory?.products?.slice(0, 4) || [];
  const streamProducts   = streamCategory?.products?.slice(0, 4)   || [];
  const headsetProducts  = headsetCategory?.products?.slice(0, 4)  || [];

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading accessories...</p>;
  }

  return (
    <>
      <Navbar />
      <Slider />
      {/* <SliderProduct /> */}

      <div className="max-w-[1300px] mx-auto mt-10 mb-10 px-4">
        {/* Categories Grid */}
        <h1 className="text-center font-bold mt-12 text-3xl">
          CATEGORIES
        </h1>
        <hr className="border border-gray-300 my-8" />

        <div className="flex flex-wrap gap-6 lg:gap-4 justify-center items-center">
          {categories.map(item => (
            <div
              key={item.id}
              className="bg-white shadow-sm w-full sm:w-1/2 md:w-1/3 lg:w-[23%] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/categories/Accessoris/${item.name}`}>
                <img
                  src={`http://localhost:9000/images/${item.img || 'placeholder.jpg'}`}
                  alt={item.title || item.name}
                  className="w-full h-40 object-contain p-4"
                  onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                />
                <p className="text-xl text-center py-3 font-medium">
                  {item.title || item.name}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* Mouse Section */}
        {mouseProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {mouseCategory?.title || "Mouse"}
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {mouseProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:9000/images/${product.image || 'no-image.jpg'}`}
                    alt={product.title || "Product"}
                    className="w-full h-[150px] object-contain mx-auto"
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                  <p className="text-lg text-center mt-3 font-medium">
                    {product.title || "Unnamed Product"}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold text-center mt-1 text-gray-800">
                      ${product.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Section */}
        {keyboardProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {keyboardCategory?.title || "Keyboard"}
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {keyboardProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:9000/images/${product.image || 'no-image.jpg'}`}
                    alt={product.title || "Product"}
                    className="w-full h-[150px] object-contain mx-auto"
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                  <p className="text-lg text-center mt-3 font-medium">
                    {product.title || "Unnamed Product"}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold text-center mt-1 text-gray-800">
                      ${product.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stream Section */}
        {streamProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {streamCategory?.title || "Streaming Gear"}
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {streamProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:9000/images/${product.image || 'no-image.jpg'}`}
                    alt={product.title || "Product"}
                    className="w-full h-[150px] object-contain mx-auto"
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                  <p className="text-lg text-center mt-3 font-medium">
                    {product.title || "Unnamed Product"}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold text-center mt-1 text-gray-800">
                      ${product.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Headset Section */}
        {headsetProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              {headsetCategory?.title || "Headset"}
            </h2>
            <hr className="border border-gray-300 mb-6" />

            <div className="flex flex-wrap gap-6 justify-center">
              {headsetProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/categories/details/${product.id}`}
                  className="bg-white shadow-md p-4 w-[250px] rounded-lg hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:9000/images/${product.image || 'no-image.jpg'}`}
                    alt={product.title || "Product"}
                    className="w-full h-[150px] object-contain mx-auto"
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                  <p className="text-lg text-center mt-3 font-medium">
                    {product.title || "Unnamed Product"}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold text-center mt-1 text-gray-800">
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