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
import MainPage from '../dashboard/MainPage';
import CustomersPage from '../dashboard/customersDb';
import CategoryPage from '../dashboard/categoryDb';
import Product from '../dashboard/productsDb';
import Sale from '../dashboard/saleDb';
import Setting from '../dashboard/settingDb'
import Invoiceold from '../dashboard/invoiceold'

// import other pages similarly

const { Header, Sider, Content } = Layout;

const App = () => {
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
        <Layout style={{ height: "100vh" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="flex flex-col items-center py-5">
                    <img src="/net.png" className="w-27 h-25 object-contain" alt="profile" />
                    {!collapsed && (
                        <div className="text-center mt-2 text-white">
                            <p className="text-[13px] opacity-70">Admin</p>
                        </div>
                    )}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[activePage]}
                    onClick={handleMenuClick}
                    items={[
                        { key: '1', icon: <HomeOutlined />, label: 'Main' },
                        { key: '2', icon: <UserAddOutlined />, label: 'Customers' },
                        { key: '3', icon: <AppstoreOutlined />, label: 'Category' },
                        { key: '4', icon: <ShopOutlined />, label: 'Products' },

                        {
                            key: 'sale',
                            icon: <DollarCircleOutlined />,
                            label: 'Invoice',
                            children: [
                                { key: '5.1', icon: <FileAddOutlined />, label: 'Invoice New' },
                                { key: '5.2', icon: <HistoryOutlined />, label: 'Invoice old' },

                            ],
                        },

                        { key: '6', icon: <SettingOutlined />, label: 'Settings' },
                        { key: '7', icon: <LogoutOutlined />, label: 'Logout' },
                    ]}
                />

            </Sider>

            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 200,
                    transition: "all 0.3s",
                    height: "100vh",
                }}
            >
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>

                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: "auto",
                        height: "calc(100vh - 88px)",
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
