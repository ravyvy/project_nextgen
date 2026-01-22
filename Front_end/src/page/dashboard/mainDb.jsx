import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    UserAddOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
    SettingOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activePage, setActivePage] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


   const renderContent = () => {
    switch (activePage) {
        case '1':
            return <h1>Main</h1>;
        case '2':
            return <h1>Customers</h1>;
        case '3':
            return <h1>Category</h1>;
        case '4-1':
            return <h1>Laptops</h1>;
        case '4-2':
            return <h1>Accessories</h1>;
        case '4-3':
            return <h1>pc_sets</h1>;
        case '4-4':
            return <h1>monitors</h1>;
        case '4-5':
            return <h1>other</h1>;
        case '5':
            return <h1>Sale</h1>;
        case '6':
            return <h1>Setting</h1>;
        case '7':
            return <h1>Logout</h1>;
        default:
            return <h1>Main</h1>;
    }
};

    return (
        <Layout style={{ height: "100vh" }}>  {/* 👈 Full screen */}

            {/* LEFT SIDEBAR */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: "auto",      // 👈 scroll only left menu
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="flex flex-col items-center py-5 ">
                    <img
                        src="/net.png"
                        className="w-27 h-25  object-contain"
                        alt="profile"
                    />

                    {!collapsed && (
                        <div className="text-center mt-2 text-white">
                            {/* <h2 className="text-[16px] font-semibold uppercase">NextGen</h2> */}
                            <p className="text-[13px] opacity-70">Admin</p>
                        </div>
                    )}
                </div>

                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(item) => setActivePage(item.key)}
                    items={[
                        { key: '1', icon: <HomeOutlined />, label: 'Main ' },
                        { key: '2', icon: <UserAddOutlined />, label: 'Cutomers ' },
                        { key: '3', icon: <AppstoreOutlined />, label: 'brand' },
                        {
                            key: '4',
                            icon: <ShoppingCartOutlined />,
                            label: 'Category',
                            children: [
                                { key: '4-1', label: 'Laptops' },
                                { key: '4-2', label: 'Accessories' },
                                { key: '4-3', label: 'pc_sets' },
                                { key: '4-4', label: 'Monitors' },
                                { key: '4-5', label: 'Others' },
                            ],
                        },
                        { key: '5', icon: <DollarCircleOutlined />, label: 'Sale' },
                        { key: '6', icon: <SettingOutlined />, label: 'Setting' },
                        { key: '7', icon: <LogoutOutlined />, label: 'Logout' },
                    ]}
                />
            </Sider>

            {/* RIGHT SIDE */}
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 200,  // 👈 moves content when sidebar opens
                    transition: "all 0.3s",
                    height: "100vh",
                }}
            >
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>

                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: "auto", // 👈 scroll only inside content if many products
                        height: "calc(100vh - 88px)", // header height 64px + margin
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>

        </Layout>
    );
};

export default App;
