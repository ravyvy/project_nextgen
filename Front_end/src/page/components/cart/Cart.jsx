import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, message } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

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
        const green = [22, 163, 74];      // green-600
        const dark = [17, 24, 39];        // gray-900
        const gray = [107, 114, 128];     // gray-500
        const light = [243, 244, 246];    // gray-100

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
        doc.text("Nextgen", 190, 24, { align: "right" });
        doc.setFontSize(10);
        doc.text("Phnom Penh, Cambodia", 190, 32, { align: "right" });
        doc.text("nextgen@gmail.shop", 190, 40, { align: "right" });

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
        doc.text("Pending", 175, 73, { align: "right" });
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

        doc.text("Delivery ", 130, finalY + 10);
        doc.text("$5", 190, finalY + 10, { align: "right" });

        doc.setLineWidth(0.8);
        doc.line(130, finalY + 15, 190, finalY + 15);

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Total", 130, finalY + 25);
        doc.setTextColor(...green);
        doc.text(`$${Number(orderDetails.total + 5 || 0).toFixed(2)}`, 190, finalY + 25, { align: "right" });

        // Footer thank you message
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        const thankY = 260;
        doc.text("Thank you for shopping with us!", 105, thankY, { align: "center" });
        doc.text("We will contact you soon to confirm delivery.", 105, thankY + 6, { align: "center" });

        // Download
        const fileName = `Invoice_${orderDetails.userName?.replace(/\s+/g, "_") || "order"}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
    };

    return (
        <>
            <Navbar />

            <div className="max-w-[900px] mx-auto mt-10 bg-white p-5 rounded shadow mb-30">
                <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

                {items.length === 0 && <h2 className="text-gray-600">Your cart is empty.</h2>}

                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-3 mb-3">
                        <img src={item.img} alt={item.title} className="w-[100px] object-cover rounded" />
                        <div className="flex-1">
                            <h2 className="font-bold">{item.title}</h2>
                            <p className="text-green-600 font-medium">${item.price}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <button
                                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span className="w-10 text-center">Qty: {item.quantity}</span>
                                <button
                                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {items.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-right">Total: ${cartTotal.toFixed(2)}</h2>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                                onClick={emptyCart}
                            >
                                Empty Cart
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                                onClick={showModal}
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Checkout Modal ──────────────────────────────────────── */}
                <Modal
                    title="Complete Your Order"
                    open={isModalOpen}
                    onOk={handleSubmitOrder}
                    onCancel={handleCancel}
                    okText="Submit Order"
                    okButtonProps={{ disabled: !position || !name || !phone }}
                    width={700}
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">Order Summary</h3>
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between py-1 border-b">
                                <span>{item.title} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold mt-3 text-lg">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="mt-5">
                            <Input
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="large"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                size="large"
                            />
                        </div>
                    </div>

                    <p className="mt-6 mb-2 font-semibold">Delivery Location:</p>
                    <p className="text-sm text-gray-600 mb-3">
                        We try to auto-detect your location. You can also click the map to adjust.
                    </p>

                    <MapContainer
                        center={mapCenter}
                        zoom={mapCenter[0] === 12.5657 ? 7 : 15}
                        style={{ height: "350px", width: "100%", borderRadius: "8px" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker position={position} setPosition={setPosition} />
                        <UserLocationSetter setPosition={setPosition} setMapCenter={setMapCenter} />
                    </MapContainer>

                    {position && (
                        <p className="mt-3 text-gray-700 text-center">
                            Selected: <strong>Lat {position[0].toFixed(5)}</strong> ,{" "}
                            <strong>Lng {position[1].toFixed(5)}</strong>
                        </p>
                    )}
                </Modal>

                {/* ─── Invoice Modal + PDF button ──────────────────────────── */}
                <Modal
                    title="Order Invoice"
                    open={isInvoiceOpen}
                    onCancel={handleCloseInvoice}
                    footer={[
                        <button
                            key="download"
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium ms-5 me-3"
                            onClick={generateInvoicePDF}
                        >
                            Download PDF Invoice
                        </button>,
                        <button
                            key="close"
                            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                            onClick={handleCloseInvoice}
                        >
                            Close
                        </button>,
                    ]}
                    width={800}
                >
                    {orderDetails && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-green-700">Thank You for Your Order!</h2>
                                <p className="text-gray-600 mt-1">Order placed on {orderDetails.orderDate}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold">Customer</h3>
                                    <p>{orderDetails.userName || "—"}</p>
                                    <p>{orderDetails.phone || "—"}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Delivery Location</h3>
                                    <p>
                                        Lat: {orderDetails.address?.lat?.toFixed(5) || "—"}<br />
                                        Lng: {orderDetails.address?.lng?.toFixed(5) || "—"}
                                    </p>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-3">Order Items</h3>
                            <div className="border rounded overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3">Item</th>
                                            <th className="p-3 text-center">Qty</th>
                                            <th className="p-3 text-right">Price</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.items.map((item) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="p-3">{item.title || "—"}</td>
                                                <td className="p-3 text-center">{item.quantity}</td>
                                                <td className="p-3 text-right">${Number(item.price || 0).toFixed(2)}</td>
                                                <td className="p-3 text-right font-medium">
                                                    ${(item.quantity * Number(item.price || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between mt-6 text-xl font-bold">
                                <span>Grand Total:</span>
                                <span className="text-green-700">${Number(orderDetails.total || 0).toFixed(2)}</span>
                            </div>

                            <p className="text-center mt-8 text-gray-500 text-sm">
                                We will contact you soon for delivery confirmation.
                            </p>
                        </div>
                    )}
                </Modal>
            </div>

            <Footer />
        </>
    );
};

export default Cart;