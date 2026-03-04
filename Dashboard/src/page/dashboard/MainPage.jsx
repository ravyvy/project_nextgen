import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';
import {
  TeamOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ThunderboltOutlined,
  BarChartOutlined
} from '@ant-design/icons';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const formatNumber = (num) => num.toLocaleString('en-US');
const formatCurrency = (num) => `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

// ────────────────────────────────────────────────
// Stat Card Component
// ────────────────────────────────────────────────
const StatCard = ({ title, value, icon, gradient, growth }) => (
  <div className={`relative overflow-hidden rounded-[2.5rem] p-8 glass-morphism border border-white/50 premium-shadow transition-all duration-500 hover:-translate-y-2 group group-active:scale-95 flex flex-col justify-between h-full`}>
    <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`}></div>

    <div className="flex items-start justify-between mb-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${gradient} text-white`}>
        {icon}
      </div>
      {growth && (
        <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-[10px] uppercase">
          <ArrowUpOutlined /> {growth}%
        </div>
      )}
    </div>

    <div className="relative z-10">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-3xl lg:text-4xl font-black text-slate-900 font-outfit tracking-tighter leading-none">{value}</p>
    </div>

    <div className="mt-8 pt-4 border-t border-slate-50 relative z-10">
      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Real-time Performance Metrics</p>
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Chart Options
// ────────────────────────────────────────────────
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      bodyFont: { family: 'Inter', weight: 'bold' },
      titleFont: { family: 'Outfit', weight: 'black' },
      cornerRadius: 12
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: 'bold', size: 10 }, color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: {
        font: { family: 'Inter', weight: 'bold', size: 10 },
        color: '#94a3b8',
        callback: (value) => `$${value}`
      }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      bodyFont: { family: 'Inter', weight: 'bold' },
      cornerRadius: 12
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: 'bold', size: 10 }, color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: { font: { family: 'Inter', weight: 'bold', size: 10 }, color: '#94a3b8' }
    }
  }
};

// ────────────────────────────────────────────────
// Main Dashboard Component
// ────────────────────────────────────────────────
const MainPage = () => {
  const [totals, setTotals] = useState({ total_records: 0, grand_total: 0 });
  const [usertotal, setusertotal] = useState({ user_records: 0 });
  const [totalcategory, settotalcategory] = useState({
    laptop: 0, accessories: 0, Ac_office_gaming: 0, Ac_office: 0, custom_pc_build: 0
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [sales, cats, users, overall] = await Promise.all([
          axios.get("https://project-nextgen-1dnjds.onrender.com/get_sale"),
          axios.get("https://project-nextgen-1dnjds.onrender.com/get_category"),
          axios.get("https://project-nextgen-1dnjds.onrender.com/get_users"),
          axios.get("https://project-nextgen-1dnjds.onrender.com/get_storeOrder")
        ]);

        if (sales.data.success) setSalesData(sales.data.data);
        if (cats.data.success) settotalcategory(cats.data.data);
        if (users.data.success) setusertotal(users.data.data);
        if (overall.data.success) setTotals(overall.data.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      }
    };
    fetchAllData();
  }, []);

  const lineData = {
    labels: salesData.length > 0 ? salesData.map(item => item.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Revenue',
      data: salesData.map(item => item.revenue),
      fill: true,
      borderColor: '#10b981',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        return gradient;
      },
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3,
      pointHoverRadius: 8
    }]
  };

  const barData = {
    labels: ['Laptops', 'Accessories', 'Gaming', 'Office', 'Custom PC'],
    datasets: [{
      label: 'Units',
      data: [
        totalcategory?.laptop || 0,
        totalcategory?.accessories || 0,
        totalcategory?.Ac_office_gaming || 0,
        totalcategory?.Ac_office || 0,
        totalcategory?.custom_pc_build || 0
      ],
      backgroundColor: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
      borderRadius: 16,
      barThickness: 32
    }]
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
            Analytics <span className="text-emerald-500 text-glow">Overview</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ThunderboltOutlined className="text-emerald-500" /> System live status: Optimal performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard
          title="Total Customers"
          value={formatNumber(usertotal.user_records || 0)}
          icon={<TeamOutlined style={{ fontSize: '24px' }} />}
          gradient="bg-emerald-600"
          growth="12.5"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totals.grand_total || 0)}
          icon={<DollarCircleOutlined style={{ fontSize: '24px' }} />}
          gradient="bg-slate-950"
          growth="8.2"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(totals.total_records || 0)}
          icon={<ShoppingOutlined style={{ fontSize: '24px' }} />}
          gradient="bg-emerald-500"
          growth="15.8"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] p-10 premium-shadow border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tighter">Growth Trends</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Revenue Tracking</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <BarChartOutlined />
            </div>
          </div>
          <div className="h-[400px] w-full">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 premium-shadow border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tighter">Inventory Levels</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Distribution</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center">
              <ShoppingOutlined />
            </div>
          </div>
          <div className="h-[400px] w-full text-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
