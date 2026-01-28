import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleDb = () => {
    const [clear, setclear] = useState([])
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        total_records: 0,
        grand_total: 0
    });
    useEffect(() => {
        const fetchDatauser = async () => {
            try {
                const res = await axios.get("http://localhost:9000/get_total");
                if (res.data.success) {
                    setTotals(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching totals:", err);
            }
        };

        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:9000/get_all_order');
                if (res.data.status) {
                    setOrders(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDatauser();
        fetchData();
    }, []); // [] មានន័យថាដើរតែម្តងគត់ពេល Component mount
    // clear
    const handleClearData = async () => {
        if (!window.confirm("តើអ្នកប្រាកដថាចង់សម្អាតទិន្នន័យមែនទេ?")) return;

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:9000/deletetotal');

            if (res.data.status) {
                alert("សម្អាតទិន្នន័យជោគជ័យ!");
                // បន្ទាប់ពីលុបហើយ អាចទាញទិន្នន័យថ្មីមកបង្ហាញ ឬ Reset state
                setTotals(null);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error clearing data:", error);
            alert("មានបញ្ហាក្នុងការលុបទិន្នន័យ");
        } finally {
            setLoading(false);
        }
    };
    const handlePrint = () => {
        window.print();
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>;

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>

            {/* Button Actions */}
            <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: '', gap: '10px' }}>
                {/* ប៊ូតុង Print */}
                <button
                    onClick={handlePrint}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'black',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🖨️ Print Orders
                </button>
                <button
                    onClick={handleClearData}
                    disabled={loading} // បិទប៊ូតុងពេលកំពុងលុប ដើម្បីកុំឱ្យចុចជាន់គ្នា
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#ccc' : 'black',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Processing...' : 'Clear Data'}
                </button>

                {/* ប៊ូតុង Clear Table */}
            </div>

            {/* Print Section */}
            <div className="print-area">
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>បញ្ជីការកម្ម៉ង់ (Order List)</h2>

                {/* Total Count */}
                {/* <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.1em', color: '#555' }}>
                    ចំនួនសរុប: <b>{orders.length}</b> Orders
                </p> */}

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'black', color: '#fff', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>User Name</th>
                            <th style={{ padding: '10px' }}>Phone</th>
                            <th style={{ padding: '10px' }}>Products</th>
                            <th style={{ padding: '10px' }}>Total</th>
                            <th style={{ padding: '10px' }}>created_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => (
                            <tr key={order.id} style={{
                                backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff',
                            }}>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{order.id}</td>
                                <td style={{ padding: '10px' }}>{order.userName}</td>
                                <td style={{ padding: '10px' }}>{order.phone}</td>
                                <td style={{ padding: '10px' }}>
                                    {order.products.map((p, index) => (
                                        <div key={index} style={{ fontSize: '0.9em', borderBottom: '1px dotted #ccc', padding: '2px 0' }}>
                                            - {p.title} (x{p.quantity}) - ${p.price}
                                        </div>
                                    ))}
                                </td>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: 'black' }}>${order.total}</td>
                                <td>
                                    {new Date(order.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Phnom_Penh' })}
                                </td>                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className=" font-semibold text-gray-500" >
                                Total&nbsp;:&nbsp; ${totals?.grand_total || 0}.00
                            </td>

                        </tr>

                    </thead>
                </table>
            </div>

            {/* CSS for print */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-area, .print-area * {
                            visibility: visible;
                        }
                        .print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SaleDb;
