import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Input,
  Tag,
  Space,
  Tooltip,
  Typography,
  message,
  Upload,
  Image
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShopOutlined,
  ReloadOutlined,
  UploadOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Text } = Typography;

const ProductsDb = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category_id: "",
    title: "",
    price: "",
    description: "",
    img: null,
  });

  const [previewImages, setPreviewImages] = useState({ img: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/get_all_product");
      const data = res.data.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      message.error("Failed to load product inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    Swal.fire({
      title: "Decommission Product?",
      text: `"${name}" will be permanently removed from the inventory system.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Confirm Remove",
      background: "#fff",
      customClass: { popup: 'rounded-[1.5rem]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://project-nextgen-1dnjds.onrender.com/remove_product/${id}`);
          message.success(`"${name}" removed from inventory.`);
          fetchProducts();
        } catch {
          message.error("Removal operation failed.");
        }
      }
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(e.target.value);
    if (!term) { setFilteredProducts(products); return; }
    setFilteredProducts(products.filter(p =>
      String(p?.id || "").includes(term) ||
      (p?.name || "").toLowerCase().includes(term) ||
      (p?.title || "").toLowerCase().includes(term) ||
      String(p?.category_id || "").includes(term)
    ));
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setForm({ id: "", name: "", category_id: "", title: "", price: "", description: "", img: null });
    setPreviewImages({ img: "" });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setForm({
      id: product.id || "",
      name: product.name || "",
      category_id: product.category_id || "",
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      img: null,
    });
    setPreviewImages({
      img: product.image ? `https://project-nextgen-1dnjds.onrender.com/images/${product.image}` : "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, img: file }));
    setPreviewImages({ img: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description || "");
    if (form.img) formData.append("img", form.img);

    try {
      const url = isEditMode
        ? `https://project-nextgen-1dnjds.onrender.com/edit_product/${currentProduct?.id}`
        : "https://project-nextgen-1dnjds.onrender.com/create_product";
      await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      message.success(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      message.error("Operation failed. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <Text className="text-[11px] font-black text-slate-400">#{id}</Text>,
    },
    {
      title: "Asset",
      key: "image",
      width: 80,
      render: (_, record) => record.image ? (
        <Image
          src={`https://project-nextgen-1dnjds.onrender.com/images/${record.image}`}
          alt={record.name}
          width={52}
          height={52}
          className="object-cover rounded-2xl border border-slate-100 shadow-sm"
          fallback="https://via.placeholder.com/52"
        />
      ) : (
        <div className="w-[52px] h-[52px] bg-slate-100 rounded-2xl flex items-center justify-center">
          <ShopOutlined className="text-slate-300 text-xl" />
        </div>
      ),
    },
    {
      title: "Product Name",
      key: "product",
      render: (_, record) => (
        <div className="flex flex-col">
          <Text className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">{record.name || "—"}</Text>
          <Text className="text-[10px] font-bold text-slate-400 mt-1 italic truncate max-w-[200px]">{record.title || "No description"}</Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (cat) => (
        <Tag className="border-none bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase tracking-widest rounded-lg">
          <AppstoreOutlined className="mr-1" />CAT-{cat || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      render: (price) => (
        <Text className="text-sm font-black text-slate-900 font-outfit tracking-tighter">${price || "0"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit Product">
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              className="h-9 w-9 bg-emerald-50 border-none text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center"
            />
          </Tooltip>
          <Tooltip title="Remove Product">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.name)}
              className="h-9 w-9 bg-rose-50 border-none text-rose-500 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
            Product <span className="text-emerald-500 text-glow">Inventory</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ShopOutlined className="text-emerald-500" />
            {filteredProducts.length} active listings in the catalog
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="SEARCH INVENTORY..."
              value={searchTerm}
              onChange={handleSearch}
              className="h-14 pl-11 pr-5 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-700 outline-none focus:border-emerald-400 transition-all w-full md:w-72 placeholder:text-slate-300"
            />
          </div>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchProducts}
              className="h-14 w-14 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all flex items-center justify-center"
            />
          </Tooltip>
          <Button
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className="h-14 bg-emerald-600 hover:bg-emerald-500 border-none text-white rounded-2xl px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/50 premium-shadow">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 15,
            className: "px-10 py-6",
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {range[0]}-{range[1]} of {total}
              </span>
            )
          }}
          className="premium-table"
        />
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={600}
        className="premium-modal"
        styles={{ content: { borderRadius: '2rem', padding: 0, overflow: 'hidden' } }}
        title={null}
        closable={false}
      >
        <div className="bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white rounded-t-[2rem]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShopOutlined style={{ fontSize: '24px' }} />
            </div>
            <div>
              <h3 className="text-xl font-black font-outfit uppercase tracking-tighter">
                {isEditMode ? "Edit" : "Create"} <span className="text-emerald-400">{isEditMode ? "Product Record" : "New Product"}</span>
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                {isEditMode ? `Modifying ID: ${currentProduct?.id}` : "Add to inventory catalog"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white rounded-b-[2rem]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product ID</label>
              <input
                name="id"
                value={form.id}
                onChange={handleInputChange}
                placeholder="AUTO / CUSTOM"
                disabled={isEditMode}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all disabled:opacity-50 uppercase"
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category ID</label>
              <input
                name="category_id"
                value={form.category_id}
                onChange={handleInputChange}
                placeholder="E.G. 1, 2, 3..."
                className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="E.G. ASUS ROG STRIX G16"
              required
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Title / Tagline</label>
            <input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="SHORT DISPLAY TITLE"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (USD)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="OPTIONAL"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Image</label>
            <label className="flex items-center gap-3 w-full h-14 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl cursor-pointer hover:border-emerald-400 transition-all group">
              <UploadOutlined className="text-slate-300 group-hover:text-emerald-500 transition-colors text-lg" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                {form.img ? form.img.name : "Upload Product Image"}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {previewImages.img && (
              <div className="mt-3 flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={previewImages.img} alt="preview" className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                <div>
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Preview</Text>
                  <Text className="text-[10px] font-bold text-slate-600">{form.img ? form.img.name : "Existing Image"}</Text>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button onClick={() => setShowModal(false)} className="h-12 px-8 bg-slate-100 border-none rounded-xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-200 transition-all">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              loading={submitting}
              className="h-12 px-10 bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
            >
              {isEditMode ? "Update Product" : "Deploy Product"}
            </Button>
          </div>
        </form>
      </Modal>

      <style>{`
        .premium-table .ant-table-thead > tr > th {
          background: #f8fafc;
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #94a3b8;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .premium-table .ant-table-tbody > tr > td {
          padding: 16px 24px;
          border-bottom: 1px solid #f8fafc;
        }
        .premium-table .ant-table-tbody > tr:hover > td {
          background: #f0fdf4 !important;
        }
        .premium-table .ant-image-img {
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default ProductsDb;