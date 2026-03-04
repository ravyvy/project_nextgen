import React from "react";
import { laptops } from "../data";
import { Link } from "react-router-dom";
import { FireFilled, ArrowRightOutlined } from "@ant-design/icons";

const SliderProducts = () => {
    // Filter only products with id 101 to 105
    const visibleLaptops = laptops.filter(item => item.id >= 101 && item.id <= 105);

    return (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-10 py-12">
            <div className="flex items-center gap-3 mb-8">
                <FireFilled className="text-3xl text-orange-500 animate-pulse" />
                <h2 className="text-slate-900 font-extrabold text-3xl lg:text-4xl">
                    Hot <span className="text-emerald-500">Promotions</span>
                </h2>
            </div>

            <div className="overflow-x-auto no-scrollbar pb-8 -mx-4 px-4">
                <div className="flex gap-8 items-stretch">
                    {visibleLaptops.map((item) => (
                        <div
                            key={item.id}
                            className="premium-card bg-white min-w-[300px] w-[300px] rounded-3xl overflow-hidden border border-slate-100 flex flex-col transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square p-6 bg-slate-50 group">
                                {item.dis && (
                                    <span className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        {item.dis}
                                    </span>
                                )}
                                <Link to={`/categories/details/${item.id}`} className="block h-full">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-3">
                                    {item.stock && (
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${item.stock.toLowerCase() === "in stock" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {item.stock}
                                        </span>
                                    )}
                                </div>

                                <Link to={`/categories/details/${item.id}`} className="block group">
                                    <h3 className="text-slate-800 font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                        {item.title}
                                    </h3>
                                </Link>

                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                                    <span className="text-2xl font-black text-slate-900">
                                        ${item.price}
                                    </span>
                                    <Link
                                        to={`/categories/details/${item.id}`}
                                        className="flex items-center gap-1 text-emerald-600 font-bold text-sm hover:gap-2 transition-all"
                                    >
                                        SHOP <ArrowRightOutlined />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default SliderProducts;
