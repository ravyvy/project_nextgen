import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    UserAddOutlined,
    DollarCircleOutlined,
    SettingOutlined,
    AppstoreOutlined,
    ShopOutlined,
    LogoutOutlined,
    FileAddOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

// Import your pages
import MainPage from './MainPage';
import CustomersPage from './customersDb';
import CategoryPage from './categoryDb';
import Product from './productsDb';
import Sale from './saleDb';
import Setting from './settingDb'
import Invoiceold from './invoiceold'

// import other pages similarly

const { Header, Sider, Content } = Layout;

const MainDb = () => {
    const navigate = useNavigate();

    const handleMenuClick = (item) => {
        if (item.key === "7") {
            if (window.confirm("Do you want logout ?🤷‍♀️")) {
                localStorage.removeItem("isAdmin");
                localStorage.removeItem("admin");
                navigate("/login_admin");
            }
        } else {
            setActivePage(item.key);
        }
    }
    const [collapsed, setCollapsed] = useState(false);
    const [activePage, setActivePage] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const renderContent = () => {
        switch (activePage) {
            case '1': return <MainPage />;
            case '2': return <CustomersPage />;
            case '3': return <CategoryPage />;
            case '4': return <Product />;
            case '5.1': return <Sale />
            case '5.2': return <Invoiceold />
            case '6': return <Setting />
            default: return <MainPage />;
        }
    };
    return (
        <Layout className="min-h-screen bg-slate-50 font-inter">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                className="glass-morphism border-r border-slate-200/50 sticky top-0 left-0 h-screen z-50 overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.8)' }}
            >
                <div className="flex flex-col items-center py-10">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-4 animate-pulse">
                        <AppstoreOutlined style={{ fontSize: '32px', color: 'white' }} />
                    </div>
                    {!collapsed && (
                        <div className="text-center animate-fade-in-up">
                            <h2 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tighter">Nextgen<span className="text-emerald-500">.</span>Admin</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Hub</p>
                        </div>
                    )}
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[activePage]}
                    onClick={handleMenuClick}
                    className="border-none bg-transparent px-3 space-y-2"
                    items={[
                        { key: '1', icon: <HomeOutlined />, label: <span className="font-bold">Dashboard</span> },
                        { key: '2', icon: <UserAddOutlined />, label: <span className="font-bold">Customers</span> },
                        { key: '3', icon: <AppstoreOutlined />, label: <span className="font-bold">Categories</span> },
                        { key: '4', icon: <ShopOutlined />, label: <span className="font-bold">Products</span> },

                        {
                            key: 'sale',
                            icon: <DollarCircleOutlined />,
                            label: <span className="font-bold">Sales & Invoices</span>,
                            children: [
                                { key: '5.1', icon: <FileAddOutlined />, label: <span className="font-medium">Recent Sales</span> },
                                { key: '5.2', icon: <HistoryOutlined />, label: <span className="font-medium">Archive</span> },

                            ],
                        },

                        { key: '6', icon: <SettingOutlined />, label: <span className="font-bold">Settings</span> },
                        { key: '7', icon: <LogoutOutlined />, label: <span className="font-bold text-rose-500">Logout</span> },
                    ]}
                />

                <div className="absolute bottom-10 left-0 right-0 px-6">
                    {!collapsed && (
                        <div className="bg-emerald-600 rounded-2xl p-4 text-white shadow-xl shadow-emerald-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="font-black text-xs">A</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-60">Session Active</p>
                                <p className="text-[12px] font-bold">Admin Portal</p>
                            </div>
                        </div>
                    )}
                </div>
            </Sider>

            <Layout className="flex flex-col transition-all duration-300">
                <Header className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-40 h-20">
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                        />
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Management Console</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-black text-slate-900 leading-none">Ravy Vy</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Super Admin</span>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 transition-colors group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </Header>

                <Content className="p-8 overflow-auto">
                    <div className="animate-fade-in-up">
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainDb;
