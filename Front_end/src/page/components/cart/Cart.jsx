import React, { useState } from "react";
import { useCart } from "react-use-cart";
import Navbar from "../navbar";
import Footer from "../footer";
import { Modal, Select, Input, Button } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const { Option } = Select;

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
    const [paymentMethod, setPaymentMethod] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState(null); // for map picker

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        console.log("Payment info:", { paymentMethod, name, phone, position });
        setIsModalOpen(false);
    };
    const handleCancel = () => setIsModalOpen(false);

    const qrCodes = {
        wing: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        acleda: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        aba: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png",
    };

    return (
        <>
            <Navbar />
            <div className="max-w-[900px] mx-auto mt-10 bg-white p-5 rounded shadow mb-30">
                <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

                {items.length === 0 && <h2>Your cart is empty.</h2>}

                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-3 mb-3">
                        <img src={item.img} className="w-[100px]" />
                        <div className="flex-1">
                            <h2 className="font-bold">{item.title}</h2>
                            <p className="text-green-600">${item.price}</p>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-300"
                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <p>Qty: {item.quantity}</p>
                                <button
                                    className="px-3 py-1 bg-gray-300"
                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {items.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold">Total: ${cartTotal}</h2>

                        <button
                            className="bg-red-500 text-white px-4 py-2 mt-4 rounded mb-10 me-3 cursor-pointer"
                            onClick={emptyCart}
                        >
                            Empty Cart
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 mt-4 rounded mb-10 cursor-pointer"
                            onClick={showModal}
                        >
                            Check Out !
                        </button>
                    </>
                )}

                <Modal
                    title="Please Scan to Pay"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Submit"
                    className="text-2xl text-center"
                >
                    {/* Cart Summary */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between mb-2">
                                <span>
                                    {item.title} x {item.quantity}
                                </span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>${cartTotal}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <Select
                            placeholder="Select Payment Method"
                            style={{ width: "100%" }}
                            onChange={(value) => setPaymentMethod(value)}
                        >
                            <Option value="wing">Wing</Option>
                            <Option value="acleda">Acleda</Option>
                            <Option value="aba">ABA</Option>
                        </Select>
                    </div>

                    {paymentMethod && (
                        <div className="text-center mb-4 ">
                            <img
                                src={qrCodes[paymentMethod]}
                                alt={`${paymentMethod} QR Code`}
                                className="w-[200px] mx-auto mb-4"
                            />
                            <div className="flex flex-col gap-4">
                                <Input placeholder="Your Name..." value={name} onChange={(e) => setName(e.target.value)} />
                                <Input placeholder="Your Phone Number..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>


                            {/* Map Picker */}
                            <p className="mb-2 font-semibold">Select Address on Map:</p>
                            <MapContainer
                                center={[11.5564, 104.9282]} // default Phnom Penh
                                zoom={12}
                                className="leaflet-container"
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationPicker position={position} setPosition={setPosition} />
                            </MapContainer>
                            {position && (
                                <p className="mt-2 text-gray-700">
                                    Selected Position: Lat {position[0]}, Lng {position[1]}
                                </p>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default Cart;
