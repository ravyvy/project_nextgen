import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { Pagination, Breadcrumb, Empty } from 'antd';
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, ThunderboltOutlined, LaptopOutlined, DesktopOutlined, AppstoreOutlined } from "@ant-design/icons";
import axios from 'axios';

const PAGE_SIZE = 12;

const CategoryLayout = ({ categoryName, title, subtitle, icon }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://project-nextgen-1dnjds.onrender.com/getall');
                const apiData = res.data.data || [];

                // Dynamic filtering and flattening based on categoryName
                const categoryData = apiData.filter(item =>
                    item.name?.toLowerCase() === categoryName?.toLowerCase()
                );

                const flattened = categoryData.flatMap(item =>
                    item.products && item.products.length > 0
                        ? item.products.map(p => ({
                            id: p.id,
                            title: p.title,
                            img: p.img || item.img,
                            price: p.price,
                            stock: p.stock,
                            dis: p.dis,
                        }))
                        : [{
                            id: item.id,
                            title: item.title,
                            img: item.img,
                            price: item.price,
                            stock: item.stock,
                            dis: item.dis,
                        }]
                );

                setProducts(flattened);
            } catch (err) {
                console.error(`Error fetching ${categoryName} products:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryName]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentProducts = products.slice(startIndex, endIndex);

    const getIcon = () => {
        if (icon) return icon;
        switch (categoryName?.toLowerCase()) {
            case 'asus':
            case 'msi':
            case 'apple':
            case 'rog':
                return <LaptopOutlined style={{ fontSize: '24px' }} />;
            case 'monitor':
                return <DesktopOutlined style={{ fontSize: '24px' }} />;
            default:
                return <AppstoreOutlined style={{ fontSize: '24px' }} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            <Navbar />

            <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <Breadcrumb
                        className="mb-4 text-xs uppercase font-bold tracking-widest"
                        items={[
                            { title: <Link to="/">Home</Link> },
                            { title: <span className="text-emerald-600">Categories</span> },
                            { title: <span className="text-slate-400 capitalize">{title || categoryName}</span> },
                        ]}
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 border border-slate-100">
                            {getIcon()}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit uppercase">
                                {title || categoryName} <span className="text-emerald-500">Series</span>
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {subtitle || `Discover our premium selection of ${title || categoryName} products.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {currentProducts.map(item => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-[2rem] overflow-hidden premium-shadow border border-slate-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
                            >
                                {item.dis && (
                                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                                        {item.dis} OFF
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${item.stock === "in stock" || item.stock === "In stock"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-red-50 text-red-600 border-red-100"
                                        }`}>
                                        {item.stock === "in stock" || item.stock === "In stock" ? "In Stock" : "Sold Out"}
                                    </span>
                                </div>

                                <Link to={`/categories/details/${item.id}`} className="relative h-64 bg-slate-50 overflow-hidden flex items-center justify-center p-8">
                                    <img
                                        src={item.img?.startsWith('http') ? item.img : `https://project-nextgen-1dnjds.onrender.com/images/${item.img}`}
                                        alt={item.title}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-emerald-600 font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            Quick View
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ThunderboltOutlined className="text-emerald-500 text-xs" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Selection</span>
                                    </div>
                                    <Link to={`/categories/details/${item.id}`}>
                                        <h2 className="text-slate-800 font-bold text-lg mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                                            {item.title}
                                        </h2>
                                    </Link>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Best Price</span>
                                            <span className="text-2xl font-black text-slate-900">${item.price}</span>
                                        </div>
                                        <Link to={`/categories/details/${item.id}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 group-hover:bg-emerald-600">
                                            <ShoppingCartOutlined />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex justify-center bg-white rounded-[2.5rem] premium-shadow border border-slate-100">
                        <Empty description={`No ${title || categoryName} products found`} />
                    </div>
                )}

                {products.length > PAGE_SIZE && (
                    <div className="mt-16 mb-8 flex justify-center">
                        <div className="bg-white p-4 rounded-3xl premium-shadow border border-slate-100">
                            <Pagination
                                current={currentPage}
                                pageSize={PAGE_SIZE}
                                total={products.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CategoryLayout;
