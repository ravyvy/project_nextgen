import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, message, Breadcrumb, Empty, Tooltip } from "antd";
import {
    ShoppingCartOutlined,
    DeleteOutlined,
    PlusOutlined,
    MinusOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
    FilePdfOutlined,
    CheckCircleFilled,
    ArrowRightOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Link } from "react-router-dom";

// Required for PDF generation
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ────────────────────────────────────────────────
//  Location Picker – allows manual click on map
// ────────────────────────────────────────────────
const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
};

// ────────────────────────────────────────────────
//  Try to get user location automatically
// ────────────────────────────────────────────────
const UserLocationSetter = ({ setPosition, setMapCenter }) => {
    const map = useMap();

    useEffect(() => {
        if (!navigator.geolocation) {
            message.warning("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const userPos = [latitude, longitude];
                setPosition(userPos);
                setMapCenter(userPos);
                map.setView(userPos, 15);
                message.success("Your location has been detected!");
            },
            (err) => {
                let msg = "Could not get your location.";
                if (err.code === 1) msg = "Location access denied. Please select manually.";
                if (err.code === 2) msg = "Position unavailable.";
                if (err.code === 3) msg = "Location request timed out.";
                message.warning(msg);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    }, [map, setPosition, setMapCenter]);

    return null;
};

const Cart = () => {
    const { items, updateItemQuantity, removeItem, emptyCart, cartTotal } = useCart();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([12.5657, 104.9910]); // Phnom Penh default

    const [orderDetails, setOrderDetails] = useState(null);

    // Reset position & map when opening checkout modal
    useEffect(() => {
        if (isModalOpen) {
            setPosition(null);
            setMapCenter([12.5657, 104.9910]);
        }
    }, [isModalOpen]);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleSubmitOrder = async () => {
        if (!name || !phone || !position) {
            return message.error("Please fill in all info and select an address.");
        }

        if (items.length === 0) return message.error("Your cart is empty!");

        try {
            const productsArray = items.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price,
            }));

            const orderData = {
                userName: name,
                phone,
                products: productsArray,
                total: cartTotal,
                address: { lat: position[0], lng: position[1] },
            };

            await axios.post("https://project-nextgen-1dnjds.onrender.com/order", orderData);

            // Prepare data for invoice display & PDF
            setOrderDetails({
                ...orderData,
                orderDate: new Date().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
                items: items, // keep original items for better display
            });

            message.success("Order placed successfully!");
            emptyCart();
            setIsModalOpen(false);
            setIsInvoiceOpen(true);

            // Reset form fields
            setName("");
            setPhone("");
            setPosition(null);
        } catch (err) {
            console.error(err);
            message.error("Failed to submit order. Please try again.");
        }
    };

    const handleCloseInvoice = () => {
        setIsInvoiceOpen(false);
        setOrderDetails(null);
    };

    // ────────────────────────────────────────────────
    //  Generate and download nice-looking PDF invoice
    // ────────────────────────────────────────────────
    const generateInvoicePDF = () => {
        if (!orderDetails) return;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Colors
        const green = [16, 185, 129];     // emerald-500
        const dark = [15, 23, 42];        // slate-900
        const gray = [100, 116, 139];     // slate-500
        const light = [248, 250, 252];    // slate-50

        // Header background
        doc.setFillColor(...green);
        doc.rect(0, 0, 210, 50, "F");

        // Title
        doc.setFontSize(24);
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 20, 32);

        // Small order number
        doc.setFontSize(11);
        doc.setTextColor(220);
        doc.text(`#${Date.now().toString().slice(-8)}`, 20, 40);

        // Shop info (top right)
        doc.setFontSize(14);
        doc.setTextColor(255);
        doc.text("Project Nextgen", 190, 24, { align: "right" });
        doc.setFontSize(10);
        doc.text("Phnom Penh, Cambodia", 190, 32, { align: "right" });
        doc.text("shop@nextgen.com", 190, 40, { align: "right" });

        let y = 65;

        // Bill To
        doc.setFontSize(12);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To", 20, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text(orderDetails.userName || "—", 20, y);
        y += 6;
        doc.text(orderDetails.phone || "—", 20, y);
        y += 6;
        doc.text(`Lat: ${orderDetails.address?.lat?.toFixed(6) || "—"}`, 20, y);
        y += 6;
        doc.text(`Lng: ${orderDetails.address?.lng?.toFixed(6) || "—"}`, 20, y);

        // Order info (right column)
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text("Order Date:", 120, 65);
        doc.text("Status:", 120, 73);
        doc.text("Payment:", 120, 81);

        doc.setTextColor(...dark);
        doc.text(orderDetails.orderDate, 175, 65, { align: "right" });
        doc.text("Confirmed", 175, 73, { align: "right" });
        doc.text("Cash on Delivery", 175, 81, { align: "right" });

        y = 105;

        // Items table
        autoTable(doc, {
            startY: y,
            head: [["Item", "Qty", "Unit Price", "Amount"]],
            body: orderDetails.items.map((item) => [
                item.title || "—",
                item.quantity,
                `$${Number(item.price || 0).toFixed(2)}`,
                `$${(item.quantity * Number(item.price || 0)).toFixed(2)}`,
            ]),
            theme: "striped",
            styles: { fontSize: 10, cellPadding: 5 },
            headStyles: {
                fillColor: green,
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: light },
            columnStyles: {
                0: { cellWidth: 95 },
                1: { cellWidth: 25, halign: "center" },
                2: { cellWidth: 35, halign: "right" },
                3: { cellWidth: 35, halign: "right" },
            },
            margin: { left: 20, right: 20 },
        });

        const finalY = doc.lastAutoTable.finalY + 12;

        // Totals
        doc.setDrawColor(...gray);
        doc.setLineWidth(0.4);
        doc.line(130, finalY - 5, 190, finalY - 5);

        doc.setFontSize(11);
        doc.setTextColor(...dark);

        doc.text("Subtotal", 130, finalY + 3);
        doc.text(`$${Number(orderDetails.total || 0).toFixed(2)}`, 190, finalY + 3, { align: "right" });

        doc.text("Delivery Fee", 130, finalY + 10);
        doc.text("Free", 190, finalY + 10, { align: "right" });

        doc.setLineWidth(0.8);
        doc.line(130, finalY + 15, 190, finalY + 15);

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Total", 130, finalY + 25);
        doc.setTextColor(...green);
        doc.text(`$${Number(orderDetails.total || 0).toFixed(2)}`, 190, finalY + 25, { align: "right" });

        // Footer thank you message
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        const thankY = 260;
        doc.text("Thank you for your premium purchase!", 105, thankY, { align: "center" });
        doc.text("Your items are being prepared for rapid dispatch.", 105, thankY + 6, { align: "center" });

        // Download
        const fileName = `Invoice_Nextgen_${orderDetails.userName?.replace(/\s+/g, "_") || "order"}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
            <Navbar />

            <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 lg:px-10 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <Breadcrumb
                        className="mb-4 text-xs uppercase font-bold tracking-widest transition-opacity"
                        items={[
                            { title: <Link to="/">Home</Link> },
                            { title: <span className="text-emerald-600 font-bold">Cart</span> },
                        ]}
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-emerald-600 border border-slate-100 transform hover:rotate-6 transition-transform">
                            <ShoppingCartOutlined style={{ fontSize: '28px' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-outfit uppercase leading-tight">
                                Your <span className="text-emerald-500">Shopping Cart</span>
                            </h1>
                            <p className="text-slate-500 text-lg font-medium">Review your selection before we deliver your premium gear.</p>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="py-24 flex justify-center bg-white rounded-[2.5rem] premium-shadow border border-slate-100">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="space-y-4 text-center">
                                    <p className="text-xl font-bold text-slate-700">Your cart is empty</p>
                                    <p className="text-slate-500 max-w-xs mx-auto">Looks like you haven't added any products to your cart yet.</p>
                                    <Link to="/" className="inline-block mt-4 bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/25">Start Shopping</Link>
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-[2rem] p-6 premium-shadow border border-slate-100 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden transition-all duration-300 hover:border-emerald-200"
                                >
                                    <Link to={`/categories/details/${item.id}`} className="relative w-32 h-32 p-4 bg-slate-50 rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-105 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700"
                                        />
                                    </Link>

                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                            <ThunderboltOutlined className="text-emerald-500 text-xs" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Selection</span>
                                        </div>
                                        <Link to={`/categories/details/${item.id}`}>
                                            <h2 className="font-black text-slate-800 text-2xl mb-2 font-outfit hover:text-emerald-600 transition-colors line-clamp-1">{item.title}</h2>
                                        </Link>
                                        <p className="text-emerald-600 font-black text-xl mb-4 font-outfit tracking-tight">${item.price}</p>

                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-emerald-500 hover:text-white rounded-lg shadow-sm transition-all"
                                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <MinusOutlined style={{ fontSize: '10px' }} />
                                                </button>
                                                <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-emerald-500 hover:text-white rounded-lg shadow-sm transition-all"
                                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <PlusOutlined style={{ fontSize: '10px' }} />
                                                </button>
                                            </div>
                                            <button
                                                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <DeleteOutlined style={{ fontSize: '20px' }} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decorative background price watermark */}
                                    <div className="absolute -bottom-2 -right-0 text-6xl font-black text-slate-900/[0.03] pointer-events-none select-none italic tracking-tighter">
                                        ${item.price}
                                    </div>
                                </div>
                            ))}

                            <div className="flex pt-4">
                                <button
                                    className="group flex items-center gap-3 text-slate-400 hover:text-rose-500 font-black uppercase tracking-widest text-xs transition-all"
                                    onClick={emptyCart}
                                >
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                                        <DeleteOutlined />
                                    </div>
                                    Empty Entire Cart
                                </button>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="lg:col-start-3">
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white premium-shadow sticky top-10 border border-slate-800">
                                <h3 className="text-2xl font-black mb-8 font-outfit uppercase tracking-tight flex items-center gap-4">
                                    Summary <div className="h-[2px] w-12 bg-emerald-500"></div>
                                </h3>

                                <div className="space-y-6 mb-10 overflow-hidden">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs group-hover:text-emerald-400 transition-colors">Subtotal</span>
                                        <span className="text-xl font-black font-outfit tracking-tight translate-x-0 group-hover:-translate-x-2 transition-transform">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs group-hover:text-emerald-400 transition-colors">Delivery</span>
                                        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] translate-x-0 group-hover:-translate-x-2 transition-transform">Free</span>
                                    </div>
                                    <hr className="border-slate-800" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-200 font-black uppercase tracking-widest text-sm">Total Amount</span>
                                        <span className="text-3xl font-black text-emerald-500 font-outfit tracking-tighter">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-6 rounded-3xl font-black uppercase tracking-[0.15em] transition-all hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-4 group mb-4"
                                    onClick={showModal}
                                >
                                    Secure Checkout
                                    <ArrowRightOutlined className="transition-transform group-hover:translate-x-2" />
                                </button>

                                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <CheckCircleFilled className="text-emerald-500" /> Secure SSL Encrypted Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Checkout Modal ──────────────────────────────────────── */}
                <Modal
                    title={
                        <div className="flex items-center gap-3 py-2">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <EnvironmentOutlined />
                            </div>
                            <div>
                                <span className="text-slate-900 font-black uppercase tracking-tight text-xl font-outfit">Checkout Details</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Confirm your delivery location</p>
                            </div>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                    centered
                    className="premium-modal"
                    bodyStyle={{ padding: '0' }}
                    closeIcon={<div className="w-10 h-10 mt-2 mr-2 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white transition-all"><ArrowRightOutlined className="rotate-45" /></div>}
                >
                    <div className="bg-white rounded-b-[2.5rem] overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left: Form */}
                            <div className="p-10 border-r border-slate-50">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 font-outfit">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            size="large"
                                            className="premium-input"
                                            prefix={<UserOutlined className="text-emerald-500" />}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <Input
                                            placeholder="+855 000 000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            size="large"
                                            className="premium-input"
                                            prefix={<PhoneOutlined className="text-emerald-500" />}
                                        />
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-bold text-[13px] italic">{items.length} Premium Items</span>
                                            <span className="text-slate-900 font-black tracking-tight font-outfit">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-emerald-600 font-black text-[13px]">
                                            <span className="italic">Delivery</span>
                                            <span>Free</span>
                                        </div>
                                        <hr className="border-slate-200 border-dashed" />
                                        <div className="flex justify-between items-center text-slate-900 font-black text-lg">
                                            <span className="font-outfit">Grand Total</span>
                                            <span className="font-outfit">${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-30 disabled:hover:bg-slate-900 disabled:cursor-not-allowed group shadow-xl shadow-slate-200"
                                    onClick={handleSubmitOrder}
                                    disabled={!position || !name || !phone}
                                >
                                    Confirm Premium Order
                                    <ArrowRightOutlined className="ml-3 transition-transform group-hover:translate-x-2" />
                                </button>
                            </div>

                            {/* Right: Map */}
                            <div className="p-10 bg-slate-50 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight font-outfit">Pin Location</h3>
                                    {!position && <span className="text-rose-500 animate-pulse text-[10px] font-black tracking-widest uppercase">Required</span>}
                                </div>
                                <div className="flex-grow rounded-3xl overflow-hidden shadow-inner border-2 border-white relative">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={mapCenter[0] === 12.5657 ? 7 : 15}
                                        style={{ height: "100%", width: "100%" }}
                                        className="checkout-map"
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker position={position} setPosition={setPosition} />
                                        <UserLocationSetter setPosition={setPosition} setMapCenter={setMapCenter} />
                                    </MapContainer>

                                    {!position && (
                                        <div className="absolute inset-x-0 bottom-4 px-4 pointer-events-none">
                                            <div className="bg-slate-900/80 backdrop-blur text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-white/10">
                                                Click map to pin address
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center gap-3 text-slate-400 capitalize">
                                        <EnvironmentOutlined className="text-emerald-500" />
                                        <span className="text-xs font-bold truncate">
                                            {position
                                                ? `Coordinates: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
                                                : "Awaiting location selection..."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* ─── Invoice Modal ────────────────────────────────────────── */}
                <Modal
                    title={null}
                    open={isInvoiceOpen}
                    onCancel={handleCloseInvoice}
                    footer={null}
                    width={700}
                    centered
                    className="premium-modal no-header"
                    bodyStyle={{ padding: '0' }}
                >
                    {orderDetails && (
                        <div className="bg-white rounded-[2.5rem] overflow-hidden text-slate-900">
                            {/* Invoice Header */}
                            <div className="bg-emerald-500 p-12 text-white flex justify-between items-end relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-5xl font-black font-outfit tracking-tighter mb-2">THANK YOU</h2>
                                    <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs">Premium gear is on the way!</p>
                                </div>
                                <div className="relative z-10 text-right">
                                    <div className="text-2xl font-black font-outfit uppercase">Invoice</div>
                                    <div className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mt-1">Order Ref: {Date.now().toString().slice(-6)}</div>
                                </div>
                                {/* Background design */}
                                <div className="absolute top-0 right-0 p-10 transform translate-x-10 -translate-y-10 opacity-10">
                                    <ShoppingCartOutlined style={{ fontSize: '300px' }} />
                                </div>
                            </div>

                            <div className="p-12">
                                <div className="grid grid-cols-2 gap-12 mb-12">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer Details</h4>
                                        <p className="text-xl font-black font-outfit text-slate-900">{orderDetails.userName || "—"}</p>
                                        <p className="text-slate-500 font-medium">{orderDetails.phone || "—"}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dispatch Address</h4>
                                        <p className="text-slate-900 font-bold truncate">Lat: {orderDetails.address?.lat?.toFixed(5)}</p>
                                        <p className="text-slate-900 font-bold">Lng: {orderDetails.address?.lng?.toFixed(5)}</p>
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Premium Line Items</h4>
                                    <div className="space-y-4">
                                        {orderDetails.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-50 group hover:border-emerald-100 transition-colors">
                                                <div>
                                                    <span className="text-slate-900 font-extrabold text-[15px]">{item.title}</span>
                                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Quantity: {item.quantity}</div>
                                                </div>
                                                <span className="text-lg font-black font-outfit text-slate-900">${(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col items-center sm:flex-row sm:justify-between sm:items-end gap-6">
                                    <div className="text-center sm:text-left">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaction</span>
                                        <div className="text-5xl font-black text-slate-900 font-outfit tracking-tighter mt-2">${orderDetails.total?.toFixed(2)}</div>
                                    </div>
                                    <div className="flex gap-4 w-full sm:w-auto">
                                        <button
                                            className="flex-grow sm:flex-grow-0 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3"
                                            onClick={generateInvoicePDF}
                                        >
                                            <FilePdfOutlined />
                                            Save Invoice
                                        </button>
                                        <button
                                            className="flex-grow sm:flex-grow-0 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
                                            onClick={handleCloseInvoice}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>

                                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-10 italic">
                                    Thank you for being part of the Nextgen community.
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
