import React, { useState } from "react";
import { useCart } from "react-use-cart";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Input, message } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map marker component
const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const Cart = () => {
    const { items, updateItemQuantity, removeItem, emptyCart, cartTotal } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState(null); // Map position

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    // ✅ Submit Order & Send to Telegram

   const handleSubmitOrder = async () => {
    if (!name || !phone || !position) {
        return message.error("Please fill in all info and select address.");
    }

    if (items.length === 0) return message.error("Your cart is empty!");

    try {
        const productsArray = items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
        }));

        await axios.post("http://localhost:9000/order", {
            userName: name,
            phone,
            products: productsArray,
            total: cartTotal,
            address: { lat: position[0], lng: position[1] }, // send address only for Telegram
        });

        message.success("Order sent successfully to DB and Telegram!");

        emptyCart();
        setIsModalOpen(false);
        setName("");
        setPhone("");
        setPosition(null);
    } catch (err) {
        console.error(err);
        message.error("Failed to submit order. Try again!");
    }
};

    return (
        <>
            <Navbar />
            <div className="max-w-[900px] mx-auto mt-10 bg-white p-5 rounded shadow mb-30">
                <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

                {items.length === 0 && <h2>Your cart is empty.</h2>}

                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-3 mb-3">
                        <img src={item.img} className="w-[100px]" />
                        <div className="flex-1">
                            <h2 className="font-bold">{item.title}</h2>
                            <p className="text-green-600">${item.price}</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-gray-300" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                <p>Qty: {item.quantity}</p>
                                <button className="px-3 py-1 bg-gray-300" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                        </div>
                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                ))}

                {items.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold">Total: ${cartTotal}</h2>
                        <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded mb-10 me-3 cursor-pointer" onClick={emptyCart}>Empty Cart</button>
                        <button className="bg-green-600 text-white px-4 py-2 mt-4 rounded mb-10 cursor-pointer" onClick={showModal}>Check Out !</button>
                    </>
                )}

                {/* Modal */}
                <Modal
                    title="Please Complete Order Info"
                    open={isModalOpen}
                    onOk={handleSubmitOrder}
                    onCancel={handleCancel}
                    okText="Submit Order"
                >
                    {/* Cart Summary */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between mb-2">
                                <span>{item.title} x {item.quantity}</span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>${cartTotal}</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <Input
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>



                    <p className="mb-2 font-semibold">Select Address on Map:</p>
                    <MapContainer center={[12.5657, 104.9910]} zoom={7} className="leaflet-container" style={{ height: "400px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker position={position} setPosition={setPosition} />
                    </MapContainer>

                    {position && (
                        <p className="mt-2 text-gray-700">
                            Selected Position: Lat {position[0]}, Lng {position[1]}
                        </p>
                    )}
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default Cart;
