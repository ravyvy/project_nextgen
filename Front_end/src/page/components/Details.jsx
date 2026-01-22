import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { accessories } from "./products/datas";
import { Carousel } from "antd";
import { useCart } from "react-use-cart";
import Swal from "sweetalert2";

const Details = () => {
  // message
  const openMessage = () => {
    return Swal.fire({
      title: "Add this product to cart?",
     icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      draggable: true
    });
  };


  // end message
  const { addItem } = useCart(); // react-use-cart
  const { id } = useParams();
  const productId = Number(id); // ensure numeric

  let product = null;

  // 1️⃣ Search nested categories
  let category = accessories.find(cat =>
    cat.products?.some(p => p.id === productId)
  );

  if (category) {
    product = category.products.find(p => p.id === productId);
  }

  // 2️⃣ Search single items
  if (!product) {
    product = accessories.find(item => item.id === productId);
  }

  const carouselRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <h1 className="text-red-600 text-4xl">Product Not Found!</h1>
        </div>
        <Footer />
      </>
    );
  }

  const images = [
    product.img,
    product.imgone,
    product.imgtwo,
    product.imgtree
  ].filter(Boolean);

  return (
    <div>
      <Navbar />

      <div className="max-w-[1000px] w-full mx-auto bg-white shadow-2xl mb-8 p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">

          {/* Carousel */}
          <div className="w-full md:w-1/2">
            <Carousel
              ref={carouselRef}
              dots
              afterChange={(index) => setCurrentImage(index)}
              className="rounded-lg overflow-hidden shadow-md"
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="product"
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-contain p-3 bg-white"
                />
              ))}
            </Carousel>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => {
                    setCurrentImage(index);
                    carouselRef.current.goTo(index);
                  }}
                  alt="thumbnail"
                  className={`w-[70px] sm:w-[90px] h-[60px] sm:h-20 object-contain border p-2 shadow-md rounded-md cursor-pointer ${currentImage === index ? "border-blue-600" : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">{product.title}</h1>

            {product.price && (
              <p className="text-lg sm:text-xl font-extrabold text-orange-400 mb-4">
                Price: ${product.price}
              </p>
            )}

            {product.stock && (
              <p className="text-lg sm:text-xl font-semibold mb-6">
                Status:
                <span
                  className={`ml-2 border rounded-sm px-2 py-1 ${product.stock === "In stock"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                    }`}
                >
                  {product.stock}
                </span>
              </p>
            )}

            {product.description && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              {/* <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
              >
                -
              </button> */}
              <span className="px-3 py-1 border rounded">{quantity}</span>
              {/* <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button> */}
            </div>

            {/* Add to Cart Button */}
            <button
              className="bg-blue-600 text-white p-3 rounded-lg text-lg hover:bg-blue-700 transition w-full sm:w-auto"
              onClick={async () => {
                const result = await openMessage(); // wait for user to click
                if (result.isConfirmed) {
                  // ✅ Only add to cart if user clicks "Yes"
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price || 0,
                    img: product.img,
                    description: product.description,
                    brand: product.brand,
                    quantity: quantity
                  });

                  Swal.fire({
                    title: "Added to cart!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                  });
                }
              }}
            >
              Add {quantity} to Cart
            </button>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;
