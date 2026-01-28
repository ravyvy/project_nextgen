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
const StatCard = ({ title, value, colorClass }) => (
  <div className={`rounded-xl p-6 text-center shadow-lg ${colorClass} text-white transition-transform duration-300 hover:scale-105`}>
    <h3 className="mb-3 text-lg font-medium opacity-90">{title}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

// ────────────────────────────────────────────────
// Chart Options
// ────────────────────────────────────────────────
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Monthly Sales Performance', font: { size: 18 } }
  },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (value) => `$${value.toLocaleString()}` } }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: 'Inventory Status by Category', font: { size: 18 } }
  }
};

// ────────────────────────────────────────────────
// Main Dashboard Component
// ────────────────────────────────────────────────
const MainPage = () => {
  // State សម្រាប់ទុកទិន្នន័យពី API
  const [totals, setTotals] = useState({
    total_records: 0,
    grand_total: 0
  });
  const [usertotal, setusertotal] = useState({
    user_records: 0
  })
  const [totalcategory, settotalcategory] = useState({
    laptop: 0,
    accessories: 0,
    Ac_office_gaming: 0,
    Ac_office: 0,
    custom_pc_build: 0
  })

  // sale
const [salesData, setSalesData] = useState([]); // សម្រាប់ Line Chart
  // ទាញទិន្នន័យពី API នៅពេល Component ដំណើរការដំបូង
useEffect(() => {
  // ១. ទាញទិន្នន័យ Sales (សម្រាប់ Line Chart)
  const fetchDatasale = async () => {
    try {
      const res = await axios.get("http://localhost:9000/get_sale");
      if (res.data.success) {
        setSalesData(res.data.data); // កែមកប្រើ state ថ្មីសម្រាប់ sale
      }
    } catch (err) {
      console.error("Error sales:", err);
    }
  };

  // ២. ទាញទិន្នន័យ Category (សម្រាប់ Bar Chart)
  const fetchDatacategory = async () => {
    try {
      const res = await axios.get("http://localhost:9000/get_category");
      if (res.data.success) {
        settotalcategory(res.data.data); 
      }
    } catch (err) {
      console.error("Error category:", err);
    }
  };

  // ៣. ទាញទិន្នន័យ User
  const fetchDatauser = async () => {
    try {
      const res = await axios.get("http://localhost:9000/get_users");
      if (res.data.success) {
        setusertotal(res.data.data);
      }
    } catch (err) {
      console.error("Error users:", err);
    }
  };

  // ៤. ទាញទិន្នន័យ Total សរុប
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9000/get_storeOrder");
      if (res.data.success) {
        setTotals(res.data.data);
      }
    } catch (err) {
      console.error("Error total:", err);
    }
  };
  fetchDatasale();
  fetchDatacategory();
  fetchDatauser();
  fetchData();
}, []);
  // ទិន្នន័យសម្រាប់ Chart (Static)
const lineData = {
  // បង្កើត labels ពី Column month (Jan, Feb...)
  labels: salesData.length > 0 ? salesData.map(item => item.month) : ['Loading...'], 
  datasets: [{
    label: 'Revenue ($)',
    // បញ្ចូលតម្លៃពី Column revenue
    data: salesData.map(item => item.revenue), 
    fill: true,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4, 
    pointRadius: 5
  }]
};
 const barData = {
  // កែ labels ឱ្យត្រូវតាមលំដាប់នៃ data ខាងក្រោម
  labels: ['Laptop', 'Accessories', 'Gaming Office', 'AC Office', 'Custom PC'], 
  datasets: [{
    label: 'Stock Level',
    data: [
      totalcategory?.laptop || 0,
      totalcategory?.accessories || 0,
      totalcategory?.Ac_office_gaming || 0,
      totalcategory?.Ac_office || 0,
      totalcategory?.custom_pc_build || 0
    ],
    backgroundColor: ['#60A5FA', '#818CF8', '#34D399', '#FBBF24', '#F87171'],
    borderRadius: 8
  }]
};

  return (
    <div className="min-h-screen  bg-slate-50 px-6 py-10 font-sans">
      <div className="mx-auto max-w-8xl">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-500">Real-time data visualization with animated charts</p>
        </header>

        {/* Stats Cards Section */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Customers"
            value={formatNumber(usertotal.user_records)}
            colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600"
          />
          <StatCard
            title="Total Amount"
            value={formatCurrency(totals.grand_total)}
            colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(totals.total_records)}
            colorClass="bg-gradient-to-br from-orange-400 to-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
            <div className="h-[400px]">
             <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
            <div className="h-[400px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;