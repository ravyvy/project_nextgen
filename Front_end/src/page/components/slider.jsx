import React from 'react';
import { Carousel } from 'antd';
import { Link } from "react-router-dom";
import {
  CarOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

const Slider = () => {
  const onChange = (currentSlide) => {
    // console.log('Slide changed to:', currentSlide);
  };

  const carouselData = [
    {
      src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      title: "Ultimate Gaming Setup",
      subtitle: "Experience high-performance gaming like never before."
    },
    {
      src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
      title: "Work with Power",
      subtitle: "Professional laptops for ultimate productivity."
    },
    {
      src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000&auto=format&fit=crop",
      title: "Precision Engineering",
      subtitle: "Custom built PC's tailored to your needs."
    },
    {
      src: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
      title: "Premium Accessories",
      subtitle: "The best gear for your gaming kingdom."
    },
  ];

  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Hero Carousel */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden premium-shadow">
            <Carousel autoplay afterChange={onChange} className="bg-slate-900 overflow-hidden">
              {carouselData.map((slide, index) => (
                <div key={index} className="relative group">
                  <div className="h-[350px] lg:h-[450px] w-full relative">
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8 lg:p-12">
                      <h2 className="text-white text-3xl lg:text-5xl font-extrabold mb-3 tracking-tight">
                        {slide.title}
                      </h2>
                      <p className="text-white/80 text-lg mb-6 max-w-lg font-light">
                        {slide.subtitle}
                      </p>
                      <div>
                        <Link to="/categories/Rog" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full font-semibold transition-all hover:gap-3">
                          Shop Now <ArrowRightOutlined />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* RIGHT — Static Promo */}
          <div className="relative rounded-3xl overflow-hidden premium-shadow group bg-slate-900">
            <img
              src="https://www.mastertechkh.com/img/categories/sec-desktop-g.jpg"
              alt="PC Build"
              className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-white text-3xl font-bold mb-4">Build Your Dream PC</h3>
              <p className="text-white/70 mb-8 text-sm max-w-[200px]">Customize every component to match your playstyle.</p>
              <Link to="/pc-build" className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                Start Building
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { icon: <CarOutlined />, color: "text-blue-500", bg: "bg-blue-50", title: "Free Shipping", desc: "Across 25 provinces" },
            { icon: <DollarOutlined />, color: "text-emerald-500", bg: "bg-emerald-50", title: "Best Prices", desc: "Unbeatable market value" },
            { icon: <SafetyCertificateOutlined />, color: "text-amber-500", bg: "bg-amber-50", title: "Official Warranty", desc: "Shop & brand protection" },
            { icon: <CustomerServiceOutlined />, color: "text-purple-500", bg: "bg-purple-50", title: "24/7 Support", desc: "Online technical assistance" },
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl flex items-center gap-5 premium-shadow hover:translate-y-[-5px] transition-all border border-slate-100">
              <div className={`${benefit.bg} ${benefit.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{benefit.title}</h4>
                <p className="text-slate-500 text-sm whitespace-nowrap">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;
