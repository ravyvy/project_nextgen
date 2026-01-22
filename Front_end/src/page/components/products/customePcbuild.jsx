// CustomePcbuild.jsx
import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, Pagination } from "antd";
import { accessories } from "./datas";
import Swal from "sweetalert2";
import { useCart } from "react-use-cart";

const { Search } = Input;

const CustomePcbuild = () => {
  const { addItem } = useCart(); // react-use-cart
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4; // number of products per page

  // Get RAM, CPU, GPU categories
  const categories = ["RAM", "CPU", "GPU"];
  const filteredCategories = accessories.filter((cat) =>
    categories.includes(cat.name)
  );

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
      p.name.toLowerCase().includes(searchText.toLowerCase())
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
      draggable: true
    }).then((result) => {
      if (result.isConfirmed) {
        addItem({
          id: product.id,
          title: product.name,
          price: product.price || 0,
          img: product.img,
          quantity: 1
        });

        Swal.fire({
          title: "Added to cart!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
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
          {filteredCategories.map((item) => (
            <div
              key={item.id}
              className="shadow-md rounded-sm p-2 hover:scale-105 transition"
              onClick={() => handleItemClick(item)}
            >
              <img
                src={item.img}
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
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{p.name}</p>
                    <p className="text-gray-600">{p.price}</p>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => handleAddToCart(p)}
                  >
                    Add
                  </button>
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
