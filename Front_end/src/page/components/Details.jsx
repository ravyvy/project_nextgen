import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { Carousel } from "antd";
import { useCart } from "react-use-cart";
import Swal from "sweetalert2";
import axios from "axios";

const Details = () => {
  const navigate = useNavigate();

  const { addItem } = useCart(); // react-use-cart
  const { id } = useParams();
  const productId = Number(id); // ensure numeric

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];

        let found = null;

        // 1️⃣ Search nested products in categories
        for (let cat of apiData) {
          if (Array.isArray(cat.products)) {
            const child = cat.products.find((p) => p.id === productId);
            if (child) {
              found = { ...child, img: child.image || cat.img || null, imgone: child.imgone || null, imgtwo: child.imgtwo || null, imgtree: child.imgtree || null };
              break;
            }
          }
        }

        // 2️⃣ Search top-level product
        if (!found) {
          const top = apiData.find((p) => p.id === productId);
          if (top) {
            found = { ...top, img: top.img || null, imgone: top.imgone || null, imgtwo: top.imgtwo || null, imgtree: top.imgtree || null };
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
      <>
        <Navbar />
        <div className="p-10 text-center">
          <p className="text-gray-600 text-2xl">Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

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

  const images = [product.img, product.imgone, product.imgtwo, product.imgtree].filter(Boolean);

  const openMessage = () =>
    Swal.fire({
      title: "Add this product to cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      draggable: true,
    });

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
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${img}`}
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
                  src={`https://project-nextgen-1dnjds.onrender.com/images/${img}`}
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
            <h1 className="text-xl sm:text-xl  mb-4"><span className="font-bold">Products :</span> {product.title}</h1>

            {product.price && (
              <p className="text-lg sm:text-xl font-extrabold text-orange-400 mb-4">
                Price: ${product.price}
              </p>
            )}

            {product.stock && (
              <p className="text-lg sm:text-xl font-semibold mb-6">
                Status:
                <span
                  className={`ml-2 border rounded-sm px-2 py-1 ${product.stock === "in stock" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                >
                  {product.stock}
                </span>
              </p>
            )}

            {product.description && (
              <p
                className="text-gray-700 mb-6 text-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 border rounded">{quantity}</span>
            </div>

            {/* Add to Cart Button */}
            <button
              className="bg-green-600 text-white p-3 rounded-lg text-lg hover:bg-green-700 cursor-pointer transition w-full sm:w-auto"
              onClick={
                async () => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    Swal.fire({
                      title: "Please login ",
                      text: "You must login to add product to cart",
                      icon: "warning",
                      confirmButtonText: "Login",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate("/account/login");
                      }
                    });
                    return;
                  }

                  const result = await openMessage();
                  if (result.isConfirmed) {
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price || 0,
                      img: `https://project-nextgen-1dnjds.onrender.com/images/${product.img}`,
                      description: product.description,
                      brand: product.brand,
                      quantity: quantity,
                    });
                    Swal.fire({
                      title: "Add Successfully! 🗃️✅",
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false,
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
