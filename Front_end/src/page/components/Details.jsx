import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { Carousel, Breadcrumb, Rate, Tag, Tooltip } from "antd";
import {
  SafetyCertificateOutlined,
  CarOutlined,
  CreditCardOutlined,
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  HeartOutlined
} from "@ant-design/icons";
import { useCart } from "react-use-cart";
import Swal from "sweetalert2";
import axios from "axios";

const Details = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(" https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];
        let found = null;

        for (let cat of apiData) {
          if (Array.isArray(cat.products)) {
            const child = cat.products.find((p) => p.id === productId);
            if (child) {
              found = { ...child, categoryName: cat.name, img: child.image || cat.img || null, imgone: child.imgone || null, imgtwo: child.imgtwo || null, imgtree: child.imgtree || null };
              break;
            }
          }
        }

        if (!found) {
          const top = apiData.find((p) => p.id === productId);
          if (top) {
            found = { ...top, categoryName: top.name, img: top.img || null, imgone: top.imgone || null, imgtwo: top.imgtwo || null, imgtree: top.imgtree || null };
          }
        }

        setProduct(found);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-inter items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8">
          <WarningOutlined style={{ fontSize: '40px' }} />
        </div>
        <h1 className="text-white text-5xl font-black mb-4 font-outfit uppercase tracking-tight">Product Not Found</h1>
        <p className="text-slate-400 mb-10 max-w-md">The component you are looking for has been moved or is currently unavailable in our inventory.</p>
        <button onClick={() => navigate('/')} className="bg-emerald-500 text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95">Go Back Home</button>
      </div>
    );
  }

  const images = [product.img, product.imgone, product.imgtwo, product.imgtree].filter(Boolean);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Identification Required",
        text: "Please login to access your premium cart.",
        icon: "info",
        confirmButtonText: "Secure Login",
        confirmButtonColor: "#10b981",
        background: '#ffffff',
        customClass: { popup: 'rounded-[2.5rem]' }
      }).then((result) => {
        if (result.isConfirmed) navigate("/account/login");
      });
      return;
    }

    const result = await Swal.fire({
      title: "Add to Selection?",
      text: `Prepare ${quantity} units of ${product.title} for your order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm Addition",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      background: '#ffffff',
      customClass: { popup: 'rounded-[2.5rem]', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
    });

    if (result.isConfirmed) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price || 0,
        img: ` https://project-nextgen-1dnjds.onrender.com/images/${product.img}`,
        description: product.description,
        brand: product.brand,
        quantity: quantity,
      });
      Swal.fire({
        title: "Added to Cart!",
        text: "Item secured in your premium selection.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-emerald-50 transition-colors">
              <LeftOutlined className="transition-transform group-hover:-translate-x-1" />
            </div>
            Back to Category
          </button>
          <Breadcrumb
            className="text-xs uppercase font-bold tracking-widest hidden md:block"
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <span className="text-slate-400 font-bold uppercase">{product.categoryName || 'Product'}</span> },
              { title: <span className="text-emerald-600 font-bold uppercase">Details</span> },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Gallery Column */}
          <div className="lg:col-span-7">
            <div className="relative group bg-white rounded-[3rem] overflow-hidden mb-8 p-12 premium-shadow border border-slate-100 flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
                <ThunderboltOutlined style={{ fontSize: '300px' }} />
              </div>

              <Carousel
                ref={carouselRef}
                dots={false}
                afterChange={(index) => setCurrentImage(index)}
                className="w-full product-carousel flex items-center justify-center"
              >
                {images.map((img, index) => (
                  <div key={index} className="!flex items-center justify-center outline-none">
                    <img
                      src={` https://project-nextgen-1dnjds.onrender.com/images/${img}`}
                      alt={product.title}
                      className="max-w-full max-h-[400px] lg:max-h-[550px] object-contain mix-blend-multiply transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                ))}
              </Carousel>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 transition-all duration-500 rounded-full ${currentImage === index ? "w-10 bg-emerald-500" : "w-1.5 bg-slate-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-5 justify-center">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImage(index);
                    carouselRef.current.goTo(index);
                  }}
                  className={`w-28 h-28 p-4 bg-white border-2 rounded-[1.5rem] transition-all duration-500 overflow-hidden relative group/thumb ${currentImage === index ? "border-emerald-500 premium-shadow scale-105" : "border-slate-100 hover:border-slate-300"}`}
                >
                  <img
                    src={` https://project-nextgen-1dnjds.onrender.com/images/${img}`}
                    alt="thumbnail"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover/thumb:scale-110"
                  />
                  {currentImage === index && <div className="absolute inset-0 bg-emerald-500/5"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Tag color="emerald" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 rounded-full font-black uppercase tracking-widest text-[10px] m-0">
                  {product.brand || 'Premium'}
                </Tag>
                <span className="text-slate-300 font-bold">/</span>
                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Reference: #{product.id}</span>
              </div>

              <h1 className="text-slate-900 text-2xl lg:text-3xl font-black leading-tight mb-6 font-outfit uppercase tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={5} className="text-sm text-amber-400" />
                  <span className="text-slate-900 font-black font-outfit text-sm ml-2">5.0</span>
                </div>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Rapid Dispatch Available</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 mb-10 premium-shadow border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-500/10">
                <CreditCardOutlined style={{ fontSize: '80px' }} />
              </div>

              <div className="relative z-10 flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-slate-900 font-outfit tracking-tighter">${product.price}</span>
                {product.dis && <span className="text-slate-400 line-through text-xl font-medium">$ {(product.price * 1.2).toFixed(2)}</span>}
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-8">Taxes and delivery included at checkout</p>

              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full inline-flex border border-emerald-100/50">
                <CheckCircleFilled className="text-emerald-500 text-xs" />
                <span className="font-black text-emerald-600 uppercase text-[10px] tracking-widest">
                  {product.stock === "in stock" ? "Verified In Stock" : "Limited Availability"}
                </span>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Engineering Details</h4>
              <div
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium italic"
                dangerouslySetInnerHTML={{ __html: product.description || "No specific details reported for this component. High-performance design guaranteed." }}
              />
            </div>

            {/* Interaction Area */}
            <div className="mt-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-slate-100 shadow-sm sm:w-48">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-emerald-500 hover:text-white transition-all text-slate-400"
                  >
                    <MinusOutlined />
                  </button>
                  <span className="px-6 font-black text-slate-900 font-outfit text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-emerald-500 hover:text-white transition-all text-slate-400"
                  >
                    <PlusOutlined />
                  </button>
                </div>

                <div className="flex-grow flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.15em] text-xs active:scale-95 group"
                  >
                    <ShoppingCartOutlined className="text-xl transition-transform group-hover:scale-125 focus:animate-pulse" /> Add To Build
                  </button>
                  <Tooltip title="Add to Wishlist">
                    <button className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 active:scale-90">
                      <HeartOutlined style={{ fontSize: '24px' }} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                <div className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <CarOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Global Shipping</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-normal">Rapid dispatch across all continents</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <SafetyCertificateOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Verified Gear</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-normal">Authenticity guaranteed with warranty</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <CreditCardOutlined style={{ fontSize: '20px' }} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Elite Security</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-normal">Encrypted transaction protocols</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Details;
