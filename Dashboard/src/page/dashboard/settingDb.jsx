import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Avatar,
  Tag,
  message,
  Divider,
  Space
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  SecurityScanOutlined,
  SettingOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SettingDb = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Security mismatch: New passwords do not align.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://project-nextgen-1dnjds.onrender.com/changeps_admin",
        {
          id: admin.id,
          oldPassword,
          newPassword,
          confirmPassword
        }
      );

      message.success(res.data.message || "Security credentials synchronized.");
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Internal security error. Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none mb-4">
          Command <span className="text-emerald-500 text-glow">Center</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
          <SettingOutlined className="text-emerald-500" /> Administrative profile & security configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="glass-morphism border-white/50 premium-shadow rounded-[3rem] text-center p-6 col-span-1 border-white/40">
          <div className="relative inline-block mb-6">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="bg-emerald-50 text-emerald-500 border-4 border-white shadow-xl"
            />
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <SecurityScanOutlined className="text-white text-[10px]" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-1">
            {admin?.username || 'System Root'}
          </h2>
          <Tag color="green" className="font-black border-none rounded-full px-4 text-[9px] uppercase tracking-widest mb-6">
            Primary Administrator
          </Tag>

          <Divider className="my-6 border-slate-100" />

          <div className="text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <SafetyCertificateOutlined className="text-slate-400" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">System Status</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <KeyOutlined className="text-slate-400" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Security Clearance</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Level 10 (Root)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Form Card */}
        <Card className="glass-morphism border-white/50 premium-shadow rounded-[3rem] col-span-1 lg:col-span-2 overflow-hidden border-white/40">
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">
                Security <span className="text-emerald-500">Protocol</span>
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Update administrative password credentials</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className="space-y-6"
            >
              <Form.Item
                name="oldPassword"
                label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Verification (Old)</span>}
                rules={[{ required: true, message: 'Current credentials required' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-300 mr-2" />}
                  placeholder="ENTER CURRENT PASSPHRASE"
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="newPassword"
                  label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">New Protocol (Key)</span>}
                  rules={[{ required: true, min: 8, message: 'Minimum 8 alphanumeric characters' }]}
                >
                  <Input.Password
                    prefix={<KeyOutlined className="text-slate-300 mr-2" />}
                    placeholder="NEW CREDENTIALS"
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Repeat Protocol</span>}
                  rules={[{ required: true, message: 'Verification required' }]}
                >
                  <Input.Password
                    prefix={<SafetyCertificateOutlined className="text-slate-300 mr-2" />}
                    placeholder="REPEAT NEW CREDENTIALS"
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold"
                  />
                </Form.Item>
              </div>

              <div className="pt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="h-16 w-full bg-emerald-600 hover:bg-emerald-500 border-none rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
                >
                  {loading ? 'SYNCHRONIZING SECURE TUNNEL...' : 'AUTHORIZE UPDATED CREDENTIALS'}
                </Button>
                <p className="text-center text-[9px] font-bold text-slate-300 mt-6 uppercase tracking-widest italic">
                  By authorizing, you accept all system audit logs for this transaction
                </p>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingDb;
