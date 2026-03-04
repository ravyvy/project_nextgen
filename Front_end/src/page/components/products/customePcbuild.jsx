import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, Pagination } from "antd";
import Swal from "sweetalert2";
import { useCart } from "react-use-cart";
import axios from "axios";
import { Link } from "react-router-dom";

const { Search } = Input;

const CustomePcbuild = () => {
  const { addItem } = useCart(); // react-use-cart
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6; // number of products per page

  // Fetch categories (RAM, CPU, GPU) from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];

        // Filter only relevant categories
        const filtered = apiData.filter((cat) =>
          ["ram", "cpu", "gpu"].includes(cat.name)
        );

        // Normalize products: ensure each product has img field
        const normalized = filtered.map((cat) => {
          const products = (cat.products || []).map((p) => ({
            ...p,
            img: p.image || cat.img || null, // 🔥 normalize image
          }));

          return { ...cat, products };
        });

        setCategories(normalized);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Click on category
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchText("");
    setPage(1);
    setOpen(true);
  };

  // Filter products by search text
  const filteredProducts =
    selectedItem?.products?.filter((p) =>
      (p.name || p.title || "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ) || [];

  // Paginate products
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Add to cart with Swal
  const handleAddToCart = (product) => {
    Swal.fire({
      title: "Add this product to cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      draggable: true,
    }).then((result) => {
      if (result.isConfirmed) {
        addItem({
          id: product.id,
          title: product.name || product.title,
          price: product.price || 0,
          img: product.img,
          quantity: 1,
        });

        Swal.fire({
          title: "Added to cart!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-[800px] mx-auto min-h-[500px] p-5">
        <h1 className="text-black font-bold text-3xl mb-4 text-center">
          CUSTOM PC BUILD
        </h1>
        <hr className="border border-gray-300 mb-6" />

        {/* CATEGORY LIST */}
        <div className="flex gap-10 flex-wrap justify-center cursor-pointer">
          {categories.map((item) => (
            <div
              key={item.id}
              className="shadow-md rounded-sm p-2 hover:scale-105 transition"
              onClick={() => handleItemClick(item)}
            >
              <img
                src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                alt={item.name}
                className="w-24 h-20 object-contain"
              />
              <h2 className="text-black font-bold text-center mt-2">
                {item.name}
              </h2>
            </div>
          ))}
        </div>

        {/* MODAL FOR PRODUCTS */}
        <Modal
          title={selectedItem?.name}
          open={open}
          width={1200}
          onCancel={() => setOpen(false)}
          footer={null}
        >
          {/* SEARCH BAR */}
          <Search
            placeholder="Search product..."
            allowClear
            enterButton
            size="large"
            className="mb-5"
            onChange={(e) => setSearchText(e.target.value)}
              
          />

          {/* PRODUCTS */}
          {paginatedProducts.length > 0 ? (
            <div className="space-y-4">
              {paginatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-md p-4 shadow hover:shadow-lg transition flex items-center gap-5"
                >
                  <Link
                    to={`/categories/details/${p.id}`}
                    className="flex items-center gap-5 w-full" // <-- make link flex
                  >
                    <img
                      src={`https://project-nextgen-1dnjds.onrender.com/images/${p.image}`}
                      alt={p.name || p.title}
                      className="w-24 h-24 object-contain"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-black text-lg">{p.name || p.title}</p>
                      <p className="text-gray-600">${p.price || 0}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No products found.</p>
          )}

          {/* PAGINATION */}
          {filteredProducts.length > pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={filteredProducts.length}
                onChange={(value) => setPage(value)}
              />
            </div>
          )}
        </Modal>
      </div>

      <Footer />
    </>
  );
};

export default CustomePcbuild;
