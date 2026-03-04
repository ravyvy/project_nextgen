import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Tag,
  Typography,
  Image,
  Card,
  Upload,
  message,
  Tooltip
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ShoppingOutlined,
  DatabaseOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

const CategoryDb = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();
  const [previewImages, setPreviewImages] = useState({ img: "", imgone: "", imgtwo: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/get_all");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      message.error("Failed to retrieve inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone and will remove the item from all listings.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      customClass: {
        title: 'font-outfit font-black',
        popup: 'rounded-[2rem]'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://project-nextgen-1dnjds.onrender.com/remove/${id}`);
          const updated = products.filter((p) => p?.id !== id);
          setProducts(updated);
          setFilteredProducts(updated);
          Swal.fire({
            title: "Removed!",
            text: "Product has been successfully deleted.",
            icon: "success",
            confirmButtonColor: "#10b981",
            customClass: { popup: 'rounded-[2rem]' }
          });
        } catch (err) {
          message.error("Failed to delete product.");
        }
      }
    });
  };

  const handleSearch = (e) => {
    const term = (e.target.value || "").toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((p) =>
      (p.name || "").toLowerCase().includes(term) ||
      (p.title || "").toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const openModal = (product = null) => {
    setIsEditMode(!!product);
    setCurrentProduct(product);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        title: product.title,
        dis: product.dis,
        price: product.price,
        stock: product.stock,
        description: product.description,
      });
      setPreviewImages({
        img: product.img ? `https://project-nextgen-1dnjds.onrender.com/images/${product.img}` : "",
        imgone: product.imgone ? `https://project-nextgen-1dnjds.onrender.com/images/${product.imgone}` : "",
        imgtwo: product.imgtwo ? `https://project-nextgen-1dnjds.onrender.com/images/${product.imgtwo}` : "",
      });
    } else {
      form.resetFields();
      setPreviewImages({ img: "", imgone: "", imgtwo: "" });
    }
    setShowModal(true);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined) formData.append(key, values[key]);
    });

    if (values.img?.file) formData.append("img", values.img.file);
    if (values.imgone?.file) formData.append("imgone", values.imgone.file);
    if (values.imgtwo?.file) formData.append("imgtwo", values.imgtwo.file);

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.post(`https://project-nextgen-1dnjds.onrender.com/edit/${currentProduct.id}`, formData);
        message.success("Product updated successfully.");
      } else {
        await axios.post("https://project-nextgen-1dnjds.onrender.com/create", formData);
        message.success("New product initialized.");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      message.error("Operation failed. Please check file sizes and formats.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
      className: "font-bold text-slate-400",
      width: 100,
    },
    {
      title: "Core Asset",
      key: "asset",
      render: (_, record) => (
        <Space size="middle">
          <div className="w-16 h-16 rounded-2xl overflow-hidden glass-morphism border border-slate-200">
            <Image
              src={`https://project-nextgen-1dnjds.onrender.com/images/${record.img}`}
              className="w-full h-full object-cover"
              fallback="/placeholder.png"
            />
          </div>
          <div className="flex flex-col">
            <Text className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">{record.name}</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{record.title}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Pricing",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="text-sm font-black text-emerald-600 font-outfit uppercase tracking-tighter">${price}</span>,
    },
    {
      title: "Inventory",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Tag color={stock > 10 ? "emerald" : "orange"} className="font-bold border-none rounded-full px-4">
          {stock} units
        </Tag>
      ),
    },
    {
      title: "Overview",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      className: "text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose",
    },
    {
      title: "Operations",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Configure Product">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              className="hover:bg-emerald-50 hover:text-emerald-500 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
            />
          </Tooltip>
          <Tooltip title="Terminate Asset">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className="hover:bg-rose-50 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
            Asset <span className="text-emerald-500 text-glow">Library</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <DatabaseOutlined className="text-emerald-500" /> Strategic inventory control & management
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input
            prefix={<SearchOutlined className="text-slate-300" />}
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleSearch}
            className="h-14 bg-white/70 backdrop-blur-md border-slate-200 rounded-2xl w-full md:w-80 font-bold shadow-sm"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            className="h-14 bg-emerald-600 hover:bg-emerald-500 border-none rounded-2xl px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
          >
            Deploy New Asset
          </Button>
        </div>
      </div>

      <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/50 premium-shadow">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 8,
            className: "px-10 py-6",
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') return <Button type="text" className="font-bold text-slate-400">Back</Button>;
              if (type === 'next') return <Button type="text" className="font-bold text-slate-900">Forward</Button>;
              return originalElement;
            }
          }}
          className="premium-table"
        />
      </div>

      <Modal
        title={
          <div className="pt-6 px-4">
            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">
              Asset <span className="text-emerald-500">{isEditMode ? "Configuration" : "Initialization"}</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Define technical parameters below</p>
          </div>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
        centered
        className="premium-modal"
        styles={{ content: { borderRadius: '3rem', padding: '0' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="p-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Form.Item name="name" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Model</span>} rules={[{ required: true }]}>
              <Input className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" placeholder="e.g. ROG STRIX X670E" />
            </Form.Item>
            <Form.Item name="title" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Variant Title</span>}>
              <Input className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" placeholder="e.g. Midnight Edition" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Form.Item name="price" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unit Price ($)</span>} rules={[{ required: true }]}>
              <Input type="number" className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
            </Form.Item>
            <Form.Item name="stock" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initial Inventory</span>} rules={[{ required: true }]}>
              <Input type="number" className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
            </Form.Item>
            <Form.Item name="dis" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Discount Label</span>}>
              <Input className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" placeholder="e.g. 15% OFF" />
            </Form.Item>
          </div>

          <Form.Item name="description" label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Technical Brief</span>}>
            <Input.TextArea rows={4} className="bg-slate-50 border-slate-100 rounded-2xl font-medium p-4" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-6">
            {["img", "imgone", "imgtwo"].map((field, idx) => (
              <Form.Item key={field} name={field} label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{idx === 0 ? "Prime Visual" : `Auxiliary ${idx}`}</span>}>
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    setPreviewImages(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
                    return false;
                  }}
                  showUploadList={false}
                >
                  <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors overflow-hidden group">
                    {previewImages[field] ? (
                      <img src={previewImages[field]} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <UploadOutlined className="text-2xl text-slate-300 group-hover:text-emerald-500 mb-2" />
                        <span className="text-[8px] font-black uppercase text-slate-400">Upload</span>
                      </>
                    )}
                  </div>
                </Upload>
              </Form.Item>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              onClick={() => setShowModal(false)}
              className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200 text-slate-400 hover:bg-slate-50"
            >
              Discard
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 border-none rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
            >
              {isEditMode ? "Synchronize Asset" : "Deploy Asset"}
            </Button>
          </div>
        </Form>
      </Modal>

      <style>{`
        .premium-table .ant-table-thead > tr > th {
            background: #f8fafc;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.1em;
            color: #94a3b8;
            padding: 24px;
            border-bottom: 1px solid #f1f5f9;
        }
        .premium-table .ant-table-tbody > tr > td {
            padding: 24px;
            border-bottom: 1px solid #f8fafc;
        }
        .premium-table .ant-table-row:hover > td {
            background: #fdfdfd !important;
        }
        .ant-modal-mask {
            backdrop-filter: blur(12px);
            background: rgba(15, 23, 42, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default CategoryDb;
