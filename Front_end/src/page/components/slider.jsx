import React from 'react';
import { Carousel } from 'antd';
import { Link } from "react-router-dom";
import {
  CarOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

const Slider = () => {
  const onChange = (currentSlide) => {
    console.log('Slide changed to:', currentSlide);
  };

  // Sample placeholder images for the carousel
  const carouselImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
  ];

  return (
    <>
      <div className="p-4 flex justify-center ">
        {/* Container: Max width set, but allows shrinking on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-[1300px]">

          {/* LEFT — Carousel (Takes up 2/3 of space on large screens) */}
          <div className="col-span-1 lg:col-span-2 w-full rounded-lg overflow-hidden shadow-lg">
            <Carousel autoplay afterChange={onChange} className="bg-gray-800 -z-10">
              {carouselImages.map((src, index) => (
                <div key={index}>
                  {/* Image styling ensures it fills the slide area */}
                  <div className="h-[250px] sm:h-[350px] lg:h-[300px] w-full relative">
                    <img
                      src={src}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* RIGHT — Promo Box (Takes up 1/3 of space on large screens) */}
          <div className="col-span-1 h-[200px] sm:h-[350px] lg:h-[300px] relative rounded-lg overflow-hidden shadow-lg group">
            {/* Background Image */}
            <img
              src="https://www.mastertechkh.com/img/categories/sec-desktop-g.jpg"
              alt="PC Build"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Button Centered on top */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <h1 className="bg-green-600 hover:bg-green-300 cursor-pointer text-white font-bold py-2 px-8 rounded-full shadow-md transition-all mt-[150px]"> <Link to="/pc-build">
                PC-Build
              </Link></h1>
             
            </div>
          </div>

        </div>
      </div>
     <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 mt-6 mb-10 cursor-pointer">
  <div className="group bg-white border border-gray-100 rounded-2xl px-6 py-8 min-w-[260px]
                  text-center shadow-md hover:shadow-xl transition duration-300">
    <CarOutlined className="text-4xl text-blue-600 mb-3 group-hover:scale-110 transition" />
    <p className="text-gray-800 font-semibold text-[17px] tracking-wide">
      ដឹកជញ្ជូន២៥ខេត្តក្រុង
    </p>
  </div>

  <div className="group bg-white border border-gray-100 rounded-2xl px-6 py-8 min-w-[260px]
                  text-center shadow-md hover:shadow-xl transition duration-300">
    <DollarOutlined className="text-4xl text-green-600 mb-3 group-hover:scale-110 transition" />
    <p className="text-gray-800 font-semibold text-[17px] tracking-wide">
      តម្លៃពិសេសជាងគេក្នុងទីក្រុង
    </p>
  </div>

  <div className="group bg-white border border-gray-100 rounded-2xl px-6 py-8 min-w-[260px]
                  text-center shadow-md hover:shadow-xl transition duration-300">
    <SafetyCertificateOutlined className="text-4xl text-emerald-600 mb-3 group-hover:scale-110 transition" />
    <p className="text-gray-800 font-semibold text-[17px] tracking-wide">
      ការធានាពីហាងនិងក្រុមហ៊ុន
    </p>
  </div>

  <div className="group bg-white border border-gray-100 rounded-2xl px-6 py-8 min-w-[260px]
                  text-center shadow-md hover:shadow-xl transition duration-300">
    <CustomerServiceOutlined className="text-4xl text-purple-600 mb-3 group-hover:scale-110 transition" />
    <p className="text-gray-800 font-semibold text-[17px] tracking-wide">
      ជំនួយតាមអ៊ីនធឺណិត
    </p>
  </div>

</div>


    </>

  );
};

export default Slider;