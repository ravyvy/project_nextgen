import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  message,
  Tooltip
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Text } = Typography;

const CustomersDb = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://project-nextgen-1dnjds.onrender.com/get_all_user");
      const data = response.data.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Failed to retrieve user registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Revoke Access?",
      text: "Permanent removal of this user profile from the security registry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Confirm Revocation",
      background: "#fff",
      customClass: {
        title: 'font-outfit font-black',
        popup: 'rounded-[2rem]'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://project-nextgen-1dnjds.onrender.com/delete_user/${id}`);
          setUsers(users.filter(user => user.id !== id));
          setFilteredUsers(filteredUsers.filter(user => user.id !== id));
          Swal.fire({
            title: "Revoked",
            text: "User profile has been decommissioned.",
            icon: "success",
            confirmButtonColor: "#10b981",
            customClass: { popup: 'rounded-[1.5rem]' }
          });
        } catch (err) {
          message.error("Revocation failed.");
        }
      }
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);
    const filtered = users.filter(
      (u) =>
        (u?.name || "").toLowerCase().includes(term) ||
        (u?.email || "").toLowerCase().includes(term) ||
        String(u?.id || "").includes(term)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "id",
      key: "id",
      className: "font-bold text-slate-400",
      width: 100,
    },
    {
      title: "Identity",
      key: "identity",
      render: (_, record) => (
        <Space size="middle">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <UserOutlined className="text-emerald-500 text-lg" />
          </div>
          <div className="flex flex-col">
            <Text className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">{record.name}</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"><MailOutlined className="mr-1" />{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Security Status",
      key: "security",
      render: () => (
        <Tag icon={<SafetyCertificateOutlined />} color="green" className="font-bold border-none rounded-full px-4 text-[10px] uppercase">
          Verified
        </Tag>
      ),
    },
    {
      title: "Registration",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <div className="flex flex-col">
          <Text className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
            {date ? new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "System Legacy"}
          </Text>
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
            <CalendarOutlined /> Onboarding Date
          </Text>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Decommission User">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="hover:bg-rose-50 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
          />
        </Tooltip>
      ),
      align: "center",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
            User <span className="text-emerald-500 text-glow">Registry</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <SafetyCertificateOutlined className="text-emerald-500" /> Administrative oversight of user credentials
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input
            prefix={<SearchOutlined className="text-slate-300" />}
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={handleSearch}
            className="h-14 bg-white border-slate-200 rounded-2xl w-full md:w-80 font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/50 premium-shadow">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 8, className: "px-10 py-6" }}
          className="premium-table"
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
      `}</style>
    </div>
  );
};

export default CustomersDb;
