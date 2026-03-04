import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Space,
    Tag,
    Typography,
    message,
    Tooltip,
    Card,
    Statistic,
    Divider
} from "antd";
import {
    PrinterOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
    DollarCircleOutlined,
    ClearOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

const SaleDb = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        total_records: 0,
        grand_total: 0
    });

    useEffect(() => {
        fetchData();
        fetchTotals();
    }, []);

    const fetchTotals = async () => {
        try {
            const res = await axios.get("https://project-nextgen-1dnjds.onrender.com/get_total");
            if (res.data.success) {
                setTotals(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching totals:", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://project-nextgen-1dnjds.onrender.com/get_all_order');
            if (res.data.status) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            message.error("Failed to load historical transaction data.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = async () => {
        Swal.fire({
            title: "Purge Transaction History?",
            text: "This operation will permanently wipe all order logs and reset the financial counters.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#f43f5e",
            confirmButtonText: "Confirm Purge",
            background: "#fff",
            customClass: {
                title: 'font-outfit font-black',
                popup: 'rounded-[2rem]'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    const res = await axios.post('https://project-nextgen-1dnjds.onrender.com/deletetotal');
                    if (res.data.status) {
                        Swal.fire({
                            title: "Data Purged",
                            text: "The financial ledger has been reset.",
                            icon: "success",
                            confirmButtonColor: "#10b981",
                            customClass: { popup: 'rounded-[1.5rem]' }
                        });
                        setTotals({ total_records: 0, grand_total: 0 });
                        setOrders([]);
                    }
                } catch (error) {
                    message.error("Purge sequence failed.");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "id",
            key: "id",
            className: "font-bold text-slate-400",
            width: 100,
        },
        {
            title: "Client Entity",
            key: "client",
            render: (_, record) => (
                <div className="flex flex-col">
                    <Text className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">{record.userName}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{record.phone}</Text>
                </div>
            ),
        },
        {
            title: "Asset Manifest",
            dataIndex: "products",
            key: "products",
            render: (products) => (
                <div className="space-y-1">
                    {products.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-600 truncate max-w-[150px]">{p.title}</Text>
                            <Tag className="m-0 text-[9px] font-black border-none bg-emerald-100 text-emerald-600 rounded-md">x{p.quantity}</Tag>
                        </div>
                    ))}
                </div>
            ),
            width: 280,
        },
        {
            title: "Revenue",
            dataIndex: "total",
            key: "total",
            render: (total) => <span className="text-sm font-black text-emerald-600 font-outfit uppercase tracking-tighter">${total}</span>,
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: "Timestamp",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <div className="flex flex-col">
                    <Text className="text-[11px] font-bold text-slate-700 uppercase tracking-tighter">
                        {new Date(date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                        <CalendarOutlined className="text-emerald-500" /> Recorded Time
                    </Text>
                </div>
            ),
        }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
                        Financial <span className="text-emerald-500 text-glow">Ledger</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <HistoryOutlined className="text-emerald-500" /> Real-time transaction monitoring & logs
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={handlePrint}
                        icon={<PrinterOutlined />}
                        className="h-14 bg-white border-slate-200 rounded-2xl px-8 font-black uppercase tracking-widest text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                    >
                        Export Manifest
                    </Button>
                    <Button
                        onClick={handleClearData}
                        danger
                        icon={<ClearOutlined />}
                        className="h-14 bg-rose-50 border-rose-100 text-rose-500 rounded-2xl px-8 font-black uppercase tracking-widest text-xs hover:bg-rose-100 transition-all shadow-sm"
                    >
                        Purge Records
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="glass-morphism border-white/50 premium-shadow rounded-[2rem]">
                    <Statistic
                        title={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Accumulated Revenue</span>}
                        value={totals?.grand_total || 0}
                        precision={2}
                        prefix={<DollarCircleOutlined className="text-emerald-500" />}
                        suffix="USD"
                        valueStyle={{ color: '#0f172a', fontWeight: '900', fontFamily: 'Outfit', letterSpacing: '-0.05em', fontSize: '2.5rem' }}
                    />
                </Card>
                <Card className="glass-morphism border-white/50 premium-shadow rounded-[2rem]">
                    <Statistic
                        title={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Transaction Volume</span>}
                        value={orders.length}
                        prefix={<ShoppingCartOutlined className="text-emerald-500" />}
                        valueStyle={{ color: '#0f172a', fontWeight: '900', fontFamily: 'Outfit', letterSpacing: '-0.05em', fontSize: '2.5rem' }}
                        suffix={<span className="text-xs font-black uppercase tracking-widest text-slate-300 ml-2">Logged Orders</span>}
                    />
                </Card>
            </div>

            <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/50 premium-shadow print-area">
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10, className: "px-10 py-6" }}
                    className="premium-table"
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row className="bg-emerald-500 text-white">
                                <Table.Summary.Cell index={0} colSpan={3} className="py-6 px-10">
                                    <Text className="text-white font-black uppercase tracking-widest text-xs font-outfit">Consolidated Financial Summary</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={2} className="py-6 px-10 text-right">
                                    <Text className="text-white font-black uppercase tracking-tighter text-xl font-outfit">Net Revenue: ${totals?.grand_total || 0}.00</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            <style>{`
                .premium-table .ant-table-thead > tr > th {
                    background: #f8fafc;
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: #94a3b8;
                    padding: 24px;
                }
                .premium-table .ant-table-tbody > tr > td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f8fafc;
                }
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .ant-table-pagination { display: none !important; }
                    .ant-table-summary { display: table-footer-group !important; }
                }
            `}</style>
        </div>
    );
};

export default SaleDb;
