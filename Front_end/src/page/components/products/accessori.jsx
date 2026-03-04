import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import SliderProduct from "../products/sliderProducts";
import Slider from "../slider";
import Footer from "../footer";
import { Link } from "react-router-dom";
import { AppstoreOutlined, ThunderboltOutlined, ShoppingCartOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Breadcrumb, Empty } from "antd";
import axios from "axios";

const Accessori = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        setAccessories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  const categories = accessories.filter(item =>
    ["mouse", "keyboard", "stream", "headset", "mousepad", "office", "razer", "game"]
      .includes(item?.name?.toLowerCase())
  );

  const mouseCategory = accessories.find(item => item?.name?.toLowerCase() === "mouse");
  const keyboardCategory = accessories.find(item => item?.name?.toLowerCase() === "keyboard");
  const streamCategory = accessories.find(item => item?.name?.toLowerCase() === "stream");
  const headsetCategory = accessories.find(item => item?.name?.toLowerCase() === "headset");

  const mouseProducts = mouseCategory?.products?.slice(0, 4) || [];
  const keyboardProducts = keyboardCategory?.products?.slice(0, 4) || [];
  const streamProducts = streamCategory?.products?.slice(0, 4) || [];
  const headsetProducts = headsetCategory?.products?.slice(0, 4) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderProductSection = (category, products, title) => {
    if (!category || products.length === 0) return null;
    return (
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8 border-l-4 border-emerald-500 pl-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-outfit uppercase">
              {title || category.title}
            </h2>
            <p className="text-slate-500 font-medium">Premium gaming and office {title || category.title.toLowerCase()}</p>
          </div>
          <Link to={`/categories/Accessoris/${category.name}`} className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-2 group transition-all">
            View All <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-[2rem] overflow-hidden premium-shadow border border-slate-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
            >
              <Link to={`/categories/details/${product.id}`} className="relative h-64 bg-slate-50 overflow-hidden flex items-center justify-center p-8">
                <img
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${product.image || 'no-image.jpg'}`}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-emerald-600 font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </div>
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <ThunderboltOutlined className="text-emerald-500 text-xs" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Gear</span>
                </div>
                <Link to={`/categories/details/${product.id}`}>
                  <h2 className="text-slate-800 font-bold text-lg mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h2>
                </Link>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Best Price</span>
                    <span className="text-2xl font-black text-slate-900">{product.price ? `$${product.price}` : 'Contact Us'}</span>
                  </div>
                  <Link to={`/categories/details/${product.id}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 group-hover:bg-emerald-600">
                    <ShoppingCartOutlined />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <Navbar />
      <Slider />

      <main className="max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <Breadcrumb
            className="mb-4 text-xs uppercase font-bold tracking-widest"
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <span className="text-emerald-600 font-bold">Categories</span> },
              { title: <span className="text-slate-400 font-bold uppercase">Accessories</span> },
            ]}
          />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-emerald-600 border border-slate-100">
              <AppstoreOutlined style={{ fontSize: '28px' }} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight font-outfit uppercase">
                Premium <span className="text-emerald-500">Accessories</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium">Complete your setup with high-end essential gear.</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
          {categories.map(item => (
            <Link
              key={item.id}
              to={`/categories/Accessoris/${item.name}`}
              className="group bg-white p-6 rounded-[2rem] premium-shadow border border-slate-100 flex flex-col items-center hover:bg-emerald-600 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-32 h-32 mb-4 overflow-hidden rounded-2xl bg-slate-50 p-4 transition-all group-hover:scale-110">
                <img
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img || 'placeholder.jpg'}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors capitalize">
                {item.title || item.name}
              </p>
            </Link>
          ))}
        </div>

        <hr className="border-slate-200" />

        {/* Product Sections */}
        {renderProductSection(mouseCategory, mouseProducts, "Gaming Mice")}
        {renderProductSection(keyboardCategory, keyboardProducts, "Keyboards")}
        {renderProductSection(streamCategory, streamProducts, "Streaming Gear")}
        {renderProductSection(headsetCategory, headsetProducts, "Headsets")}

        {(mouseProducts.length === 0 && keyboardProducts.length === 0 && streamProducts.length === 0 && headsetProducts.length === 0) && (
          <div className="py-20 flex justify-center bg-white rounded-[2.5rem] premium-shadow border border-slate-100">
            <Empty description="Explore our categories to find the perfect gear for your setup" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Accessori;
