import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductsDb = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // ← change this number if you want more/fewer items per page

  // modal
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // form
  const [form, setForm] = useState({
    id: "",
    name: "",
    category_id: "",
    title: "",
    price: "",
    description: "",
    img: null,
  });

  const [previewImages, setPreviewImages] = useState({
    img: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:9000/get_all_product");
      const data = res.data.data || [];
      setProducts(data);
      setFilteredProducts(data);
      setCurrentPage(1); // reset pagination when data is refreshed
    } catch (err) {
      console.error(err);
      setError("Data not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកចង់លុប product នេះមែនទេ?")) return;
    try {
      await axios.delete(`http://localhost:9000/remove_product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);
    setCurrentPage(1); // reset to page 1 when searching

    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (p) =>
        String(p?.id || "").includes(term) ||
        (p?.name || "").toLowerCase().includes(term) ||
        (p?.title || "").toLowerCase().includes(term) ||
        String(p?.category_id || "").includes(term)
    );

    setFilteredProducts(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setForm({
      id: "",
      name: "",
      category_id: "",
      title: "",
      price: "",
      description: "",
      img: null,
    });
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
      img: product.image
        ? `http://localhost:9000/images/${product.image}`
        : "",
    });

    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, img: file }));
    setPreviewImages({ img: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description || "");

    if (form.img) {
      formData.append("img", form.img);
    }

    try {
      const url = isEditMode
        ? `http://localhost:9000/edit_product/${currentProduct?.id}`
        : "http://localhost:9000/create_product";

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchProducts();
      setShowModal(false);
      alert(isEditMode ? "Update success!" : "Create success!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Submit failed!");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Table</h2>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={openCreateModal}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-center">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-center">Category</th>
              <th className="py-3 px-4 text-center">Image</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-center">Price</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              currentItems.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-center">{p.id}</td>
                  <td className="py-4 px-4">{p.name || "—"}</td>
                  <td className="py-4 px-4 text-center">{p.category_id || "—"}</td>
                  <td className="py-4 px-4 text-center">
                    {p.image ? (
                      <img
                        src={`http://localhost:9000/images/${p.image}`}
                        alt={p.name || "product"}
                        className="w-12 h-12 object-cover rounded mx-auto"
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 px-4">{p.title || "—"}</td>
                  <td className="py-4 px-4 text-center font-medium">
                    ${p.price || "0"}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, filteredProducts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredProducts.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded min-w-10 ${
                  currentPage === page
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-lg rounded-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Product" : "Create Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  name="id"
                  value={form.id}
                  onChange={handleInputChange}
                  placeholder="ID"
                  className="border w-full px-3 py-2 rounded"
                  disabled={isEditMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="border w-full px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category ID</label>
                <input
                  name="category_id"
                  value={form.category_id}
                  onChange={handleInputChange}
                  placeholder="Category ID"
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {previewImages.img && (
                  <div className="mt-3">
                    <img
                      src={previewImages.img}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

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

export default ProductsDb;