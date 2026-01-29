import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryDb = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // ← you can change this (e.g. 5, 15, 20)

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    dis: "",
    price: "",
    stock: "",
    description: "",
    img: null,
    imgone: null,
    imgtwo: null,
  });

  const [previewImages, setPreviewImages] = useState({
    img: "",
    imgone: "",
    imgtwo: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:9000/get_all");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProducts(data);
      setFilteredProducts(data);
      setCurrentPage(1); // reset to page 1 after new fetch
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("មិនអាចទាញយកទិន្នន័យបានទេ!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកចង់លុប product នេះមែនទេ?")) return;
    try {
      await axios.delete(`http://localhost:9000/remove/${id}`);
      const updated = products.filter((p) => p?.id !== id);
      setProducts(updated);
      setFilteredProducts(updated);
      // Optional: adjust currentPage if last page becomes empty
    } catch (err) {
      console.error("Delete failed:", err);
      alert("លុបមិនបានទេ!");
    }
  };

  const handleSearch = (e) => {
    const term = (e.target.value || "").trim();
    setSearchTerm(term);
    setCurrentPage(1); // reset to page 1 on search

    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = products.filter((p) => {
      if (!p) return false;
      return (
        (p.name || "").toLowerCase().includes(lowerTerm) ||
        (p.title || "").toLowerCase().includes(lowerTerm) ||
        (p.dis || "").toLowerCase().includes(lowerTerm) ||
        (p.description || "").toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredProducts(filtered);
  };

  // ── Pagination Logic ───────────────────────────────────────
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // ── Modal handlers (unchanged except minor safety) ────────
  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setForm({
      name: "",
      title: "",
      dis: "",
      price: "",
      stock: "",
      description: "",
      img: null,
      imgone: null,
      imgtwo: null,
    });
    setPreviewImages({ img: "", imgone: "", imgtwo: "" });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    if (!product?.id) {
      alert("Invalid product selected");
      return;
    }
    setIsEditMode(true);
    setCurrentProduct(product);
    setForm({
      name: product.name || "",
      title: product.title || "",
      dis: product.dis || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      img: null,
      imgone: null,
      imgtwo: null,
    });
    setPreviewImages({
      img: product.img ? `http://localhost:9000/images/${product.img}` : "",
      imgone: product.imgone ? `http://localhost:9000/images/${product.imgone}` : "",
      imgtwo: product.imgtwo ? `http://localhost:9000/images/${product.imgtwo}` : "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, [field]: file }));
    setPreviewImages((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name || "");
    formData.append("title", form.title || "");
    formData.append("dis", form.dis || "");
    formData.append("price", form.price || "");
    formData.append("stock", form.stock || "");
    formData.append("description", form.description || "");

    if (form.img) formData.append("img", form.img);
    if (form.imgone) formData.append("imgone", form.imgone);
    if (form.imgtwo) formData.append("imgtwo", form.imgtwo);

    try {
      if (isEditMode) {
        if (!currentProduct?.id) throw new Error("Missing product ID");
        await axios.post(
          `http://localhost:9000/edit/${currentProduct.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://localhost:9000/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err);
      alert(isEditMode ? "កែប្រែមិនបានទេ!" : "បង្កើតមិនបានទេ!");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Table</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-3 py-2 w-64"
          />
          <button
            onClick={openCreateModal}
            className="bg-yellow-600 px-6 py-2 text-white font-semibold rounded cursor-pointer"
          >
           ➕
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Main Image</th>
              <th>Hover 1</th>
              <th>Hover 2</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-400">
                  No Data Available
                </td>
              </tr>
            ) : (
              currentItems.map((p) => (
                <tr key={p?.id || Math.random()} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center">{p?.id ?? "—"}</td>
                  <td className="p-3">{p?.name ?? "—"}</td>
                  <td className="p-3">{p?.title ?? "—"}</td>
                  <td className="p-3">
                    {p?.img && (
                      <img
                        src={`http://localhost:9000/images/${p.img}`}
                        alt="main"
                        className="w-16 h-16 object-cover rounded shadow-sm mx-auto"
                        onError={(e) => (e.target.src = "/placeholder-image.png")}
                      />
                    )}
                  </td>
                  <td className="p-3">
                    {p?.imgone && (
                      <img
                        src={`http://localhost:9000/images/${p.imgone}`}
                        alt="hover 1"
                        className="w-16 h-16 object-cover rounded shadow-sm mx-auto"
                        onError={(e) => (e.target.src = "/placeholder-image.png")}
                      />
                    )}
                  </td>
                  <td className="p-3">
                    {p?.imgtwo && (
                      <img
                        src={`http://localhost:9000/images/${p.imgtwo}`}
                        alt="hover 2"
                        className="w-16 h-16 object-cover rounded shadow-sm mx-auto"
                        onError={(e) => (e.target.src = "/placeholder-image.png")}
                      />
                    )}
                  </td>
                  <td className="p-3 font-medium">${p?.price ?? "0"}</td>
                  <td className="p-3">{p?.stock ?? "—"}</td>
                  <td className="p-3 max-w-xs truncate">{p?.description ?? "—"}</td>
                  <td className="p-3 space-x-2 text-center">
                    <button
                      onClick={() => openEditModal(p)}
                      className="    text-white px-3 py-1 rounded text-sm cursor-pointer  hover:bg-yellow-600"
                    >
                      🔍
                    </button>
                    <button
                      onClick={() => handleDelete(p?.id)}
                      className="  text-white px-3 py-1 rounded cursor-pointer text-sm  hover:bg-red-600"
                    >
                       🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Controls ────────────────────────────────── */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, filteredProducts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredProducts.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal remains the same */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Dis (Discount?)</label>
                <input
                  type="text"
                  name="dis"
                  value={form.dis}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Stock</label>
                  <input
                    type="text"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {["img", "imgone", "imgtwo"].map((field, i) => (
                <div key={field}>
                  <label className="block mb-1 font-medium">
                    {i === 0 ? "Main Image" : `Hover Image ${i}`}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, field)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {previewImages[field] && (
                    <div className="mt-2">
                      <img
                        src={previewImages[field]}
                        alt={`preview ${field}`}
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDb;