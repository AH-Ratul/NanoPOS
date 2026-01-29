import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Space, theme } from 'antd';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.05)' }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
                        {collapsed ? 'NP' : 'NanoPOS'}
                    </Title>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={handleMenuClick}
                    items={[
                        {
                            key: '/dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: '/pos',
                            icon: <ShoppingCartOutlined />,
                            label: 'POS / Sales',
                        },
                        {
                            key: '/inventory',
                            icon: <InboxOutlined />,
                            label: 'Inventory',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    
                    <Space size="large">
                        <Space>
                            <UserOutlined />
                            <Text strong>{user?.name}</Text>
                        </Space>
                        <Button 
                            type="text" 
                            icon={<LogoutOutlined />} 
                            onClick={handleLogout}
                            danger
                        >
                            Logout
                        </Button>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflowY: 'auto'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
