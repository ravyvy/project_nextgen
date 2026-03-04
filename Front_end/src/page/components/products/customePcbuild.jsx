import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, Pagination, Breadcrumb, Empty, Tooltip } from "antd";
import {
  ExperimentOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  InfoCircleOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useCart } from "react-use-cart";
import axios from "axios";
import { Link } from "react-router-dom";

const { Search } = Input;

const CustomePcbuild = () => {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/getall");
        const apiData = response.data.data || [];

        const filtered = apiData.filter((cat) =>
          ["ram", "cpu", "gpu"].includes(cat.name?.toLowerCase())
        );

        const normalized = filtered.map((cat) => {
          const products = (cat.products || []).map((p) => ({
            ...p,
            img: p.image || cat.img || null,
          }));
          return { ...cat, products };
        });

        setCategories(normalized);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchText("");
    setPage(1);
    setOpen(true);
  };

  const filteredProducts =
    selectedItem?.products?.filter((p) =>
      (p.name || p.title || "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ) || [];

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAddToCart = (product) => {
    Swal.fire({
      title: "Add to Build?",
      text: `Add ${product.name || product.title} to your custom build cart?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: "Add Component",
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-2 font-bold',
        cancelButton: 'rounded-xl px-6 py-2 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        addItem({
          id: product.id,
          title: product.name || product.title,
          price: product.price || 0,
          img: product.img || product.image,
          quantity: 1,
        });

        Swal.fire({
          title: "Added!",
          text: "Component included in your build.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-[2rem]'
          }
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 lg:px-10 py-12">
        <div className="mb-12 text-center">
          <Breadcrumb
            className="mb-4 text-xs uppercase font-bold tracking-widest justify-center"
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <span className="text-emerald-600 font-bold">Build</span> },
            ]}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md text-emerald-600 border border-slate-100 mb-2 rotate-3 hover:rotate-0 transition-transform duration-300">
              <ExperimentOutlined style={{ fontSize: '32px' }} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight font-outfit uppercase leading-tight">
              Custom <span className="text-emerald-500 text-glow">PC Builder</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">
              "Craft your masterpiece. Select high-performance components to build your dream powerhouse."
            </p>
          </div>
        </div>

        {/* CATEGORY LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-4xl mx-auto">
          {categories.map((item) => (
            <div
              key={item.id}
              className="group relative"
              onClick={() => handleItemClick(item)}
            >
              {/* Glass Card Effect */}
              <div className="absolute inset-x-0 -bottom-2 h-full bg-slate-200/50 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] premium-shadow flex flex-col items-center cursor-pointer transition-all duration-500 hover:-translate-y-4 group-active:scale-95 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-emerald-500 transition-all">
                  <InfoCircleOutlined />
                </div>

                <div className="w-32 h-32 mb-6 flex items-center justify-center bg-slate-50 rounded-3xl p-4 transition-transform duration-500 group-hover:scale-110">
                  <img
                    src={`https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                  Configure <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
                </div>

                {/* Glowing border on hover */}
                <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/50 rounded-[2.5rem] transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Section */}
        <div className="mt-32 p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="relative z-10 flex-1">
            <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">Professional Guidance</span>
            <h2 className="text-4xl font-black mt-4 mb-6 font-outfit capitalize">Need help picking parts?</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Our experts are ready to help you optimize your build for gaming, streaming, or professional productivity.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-emerald-500/25 flex items-center gap-3 active:scale-95">
              Contact Support <ThunderboltOutlined />
            </button>
          </div>
          <div className="relative z-10 w-full md:w-1/3 aspect-square bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-3xl flex items-center justify-center p-10 animate-pulse-slow">
            <ExperimentOutlined className="text-[100px] text-emerald-500 opacity-50" />
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* MODAL FOR PRODUCTS */}
        <Modal
          title={
            <div className="flex items-center gap-3 py-2">
              <span className="text-emerald-600 uppercase font-black tracking-widest text-sm">Select Component</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-black uppercase tracking-tight text-xl font-outfit">{selectedItem?.name}</span>
            </div>
          }
          open={open}
          centered
          width={1000}
          onCancel={() => setOpen(false)}
          footer={null}
          closeIcon={<div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white transition-all"><ArrowRightOutlined className="rotate-45" /></div>}
          className="premium-modal"
          bodyStyle={{ padding: '2rem' }}
        >
          {/* SEARCH BAR */}
          <div className="relative mb-8 group">
            <Search
              placeholder={`Search ${selectedItem?.name || 'products'}...`}
              allowClear
              size="large"
              prefix={<SearchOutlined className="text-emerald-500" />}
              className="premium-search"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* PRODUCTS LIST */}
          {paginatedProducts.length > 0 ? (
            <div className="space-y-6">
              {paginatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-slate-50 border border-slate-100 rounded-[2rem] p-6 transition-all duration-300 hover:bg-white hover:premium-shadow hover:border-white flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden"
                >
                  <div className="relative w-32 h-32 p-4 bg-white rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={`https://project-nextgen-1dnjds.onrender.com/images/${p.image || p.img}`}
                      alt={p.name || p.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <CheckCircleFilled className="text-emerald-500 text-xs" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Component</span>
                    </div>
                    <Link to={`/categories/details/${p.id}`} className="block group/link">
                      <h3 className="font-black text-slate-800 text-2xl mb-2 font-outfit group-hover/link:text-emerald-600 transition-colors">
                        {p.name || p.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <span className="text-2xl font-black text-emerald-600">${p.price || 0}</span>
                      <span className="text-slate-300 text-lg">|</span>
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">High Performance</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                    <Link
                      to={`/categories/details/${p.id}`}
                      className="text-slate-400 hover:text-emerald-500 font-bold text-xs uppercase tracking-widest transition-colors px-4"
                    >
                      Specifications
                    </Link>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full sm:w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 group-hover:bg-emerald-600 active:scale-90"
                    >
                      <ShoppingCartOutlined />
                    </button>
                  </div>

                  {/* Decorative background number */}
                  <div className="absolute -bottom-10 -right-5 text-[150px] font-black text-slate-900/[0.03] pointer-events-none select-none italic tracking-tighter">
                    {p.id % 99}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex justify-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
              <Empty description={<span className="text-slate-400 font-medium">No components found matching your search.</span>} />
            </div>
          )}

          {/* PAGINATION */}
          {filteredProducts.length > pageSize && (
            <div className="flex justify-center mt-12">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={filteredProducts.length}
                onChange={(value) => {
                  setPage(value);
                  // Scroll modal to top
                  document.querySelector('.ant-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="premium-pagination"
              />
            </div>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
};

export default CustomePcbuild;
