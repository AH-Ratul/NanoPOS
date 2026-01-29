import React from 'react';
import { Typography, Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { InboxOutlined, ShoppingCartOutlined, StockOutlined, DollarOutlined } from '@ant-design/icons';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import dayjs from 'dayjs';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
    const { data: products } = useProducts();
    const { data: sales } = useSales();

    const totalRevenue = sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
    const lowStockItems = products?.filter(p => p.stock_quantity < 10).length || 0;

    const recentSalesColumns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Items',
            dataIndex: 'saleItems',
            key: 'items',
            render: (items: any[]) => items.length,
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'total',
            render: (amount: number) => <Tag color="green">${amount.toFixed(2)}</Tag>,
        },
    ];

    return (
        <div>
            <Title level={2}>Dashboard</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title="Total Revenue"
                            value={totalRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title="Total Sales"
                            value={sales?.length || 0}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title="Total Products"
                            value={products?.length || 0}
                            prefix={<InboxOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title="Low Stock Items"
                            value={lowStockItems}
                            prefix={<StockOutlined />}
                            valueStyle={{ color: lowStockItems > 0 ? '#cf1322' : 'inherit' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 32 }}>
                <Title level={3}>Recent Sales</Title>
                <Table 
                    columns={recentSalesColumns} 
                    dataSource={sales?.slice(0, 5)} 
                    rowKey="id" 
                    pagination={false}
                    bordered
                />
            </div>
        </div>
    );
};

export default DashboardPage;
