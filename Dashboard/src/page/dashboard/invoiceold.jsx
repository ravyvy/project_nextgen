import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Card,
  Statistic,
  Tooltip
} from "antd";
import {
  PrinterOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  FileSearchOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const Invoiceold = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    total_records: 0,
    grand_total: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://project-nextgen-1dnjds.onrender.com/totalold');

      if (res.data?.message === 'select success' || res.data?.status) {
        const rawData = res.data.data || [];

        const parsedOrders = rawData.map(order => ({
          ...order,
          products: typeof order.products === 'string'
            ? JSON.parse(order.products)
            : (Array.isArray(order.products) ? order.products : []),
          total: Number(order.total || 0),
        }));

        setOrders(parsedOrders);

        const grandTotal = parsedOrders.reduce((sum, o) => sum + o.total, 0);
        setTotals({
          total_records: parsedOrders.length,
          grand_total: Number(grandTotal.toFixed(2)),
        });
      } else {
        message.warning("Archive returned an unexpected format.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      message.error("Failed to synchronize with historical archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: "Archive ID",
      dataIndex: "id",
      key: "id",
      className: "font-bold text-slate-400",
      width: 100,
    },
    {
      title: "Legacy Client",
      key: "client",
      render: (_, record) => (
        <div className="flex flex-col">
          <Text className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">{record.userName || "Unknown Entity"}</Text>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{record.phone || "No Contact Link"}</Text>
        </div>
      ),
    },
    {
      title: "System Manifest",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div className="space-y-1">
          {products.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-50/70 px-3 py-1.5 rounded-lg border border-slate-100">
              <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-500 truncate max-w-[150px]">{p.title}</Text>
              <Tag className="m-0 text-[9px] font-black border-none bg-slate-200 text-slate-500 rounded-md">x{p.quantity}</Tag>
            </div>
          ))}
        </div>
      ),
      width: 280,
    },
    {
      title: "Settled Value",
      dataIndex: "total",
      key: "total",
      render: (total) => <span className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter">${Number(total).toFixed(2)}</span>,
    },
    {
      title: "Archival Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex flex-col">
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
            {date ? new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : "Historical"}
          </Text>
          <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
            <DatabaseOutlined className="text-slate-300" /> Storage Stamp
          </Text>
        </div>
      ),
    }
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Tag color="default" className="font-black border-none bg-slate-100 text-slate-400 rounded-lg px-2 text-[9px] uppercase tracking-widest">Repository</Tag>
            <Tag color="warning" className="font-black border-none bg-amber-50 text-amber-600 rounded-lg px-2 text-[9px] uppercase tracking-widest">Legacy Records</Tag>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">
            Historical <span className="text-slate-400 text-glow">Archives</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={handlePrint}
            icon={<PrinterOutlined />}
            className="h-14 bg-white border-slate-200 rounded-2xl px-8 font-black uppercase tracking-widest text-xs hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            Print Cold Storage
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="glass-morphism border-white/50 premium-shadow rounded-[2rem]">
          <Statistic
            title={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Total Historical Value</span>}
            value={totals.grand_total}
            precision={2}
            prefix={<DollarCircleOutlined className="text-slate-300" />}
            suffix="USD"
            valueStyle={{ color: '#64748b', fontWeight: '900', fontFamily: 'Outfit', letterSpacing: '-0.05em', fontSize: '2.5rem' }}
          />
        </Card>
        <Card className="glass-morphism border-white/50 premium-shadow rounded-[2rem]">
          <Statistic
            title={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Archived Volume</span>}
            value={totals.total_records}
            prefix={<FileSearchOutlined className="text-slate-300" />}
            valueStyle={{ color: '#64748b', fontWeight: '900', fontFamily: 'Outfit', letterSpacing: '-0.05em', fontSize: '2.5rem' }}
            suffix={<span className="text-xs font-black uppercase tracking-widest text-slate-300 ml-2">Stored Entries</span>}
          />
        </Card>
      </div>

      <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/50 premium-shadow print-area grayscale-hover transition-all">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 12, className: "px-10 py-6" }}
          className="premium-table archival-table"
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-slate-100">
                <Table.Summary.Cell index={0} colSpan={3} className="py-6 px-10">
                  <Text className="text-slate-400 font-black uppercase tracking-widest text-[9px] font-outfit">Archival Ledger Summary (Resolved)</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className="py-6 px-10 text-right">
                  <Text className="text-slate-900 font-black uppercase tracking-tighter text-xl font-outfit">Total Value: ${totals.grand_total.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <style>{`
        .archival-table .ant-table-thead > tr > th {
            background: #f1f5f9;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.1em;
            color: #64748b;
            padding: 24px;
        }
        .archival-table .ant-table-tbody > tr > td {
            padding: 20px 24px;
            border-bottom: 1px solid #f1f5f9;
        }
        .grayscale-hover:hover {
            filter: grayscale(0);
        }
        .grayscale-hover {
            filter: grayscale(0.5);
        }
        @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .ant-table-pagination { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoiceold;
