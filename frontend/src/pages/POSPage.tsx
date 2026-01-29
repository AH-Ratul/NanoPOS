import React, { useState } from 'react';
import { 
    Typography, 
    Row, 
    Col, 
    Card, 
    List, 
    Button, 
    Input, 
    Badge, 
    Avatar, 
    message, 
    Empty,
    Space} from 'antd';
import { 
    ShoppingCartOutlined, 
    PlusOutlined, 
    MinusOutlined, 
    DeleteOutlined, 
    SearchOutlined,
    CheckCircleOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { useProducts, type Product } from '../hooks/useProducts';
import { useCreateSale } from '../hooks/useSales';

const { Title, Text } = Typography;

interface CartItem extends Product {
    cartQuantity: number;
}

const POSPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const { data: products, isLoading } = useProducts();
    const createSale = useCreateSale();

    const filteredProducts = products?.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        if (product.stock_quantity <= 0) {
            message.error('Out of stock!');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.cartQuantity >= product.stock_quantity) {
                    message.warning(`Only ${product.stock_quantity} available in stock`);
                    return prev;
                }
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, cartQuantity: item.cartQuantity + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.cartQuantity + delta;
                if (newQty > item.stock_quantity) {
                    message.warning(`Only ${item.stock_quantity} available in stock`);
                    return item;
                }
                if (newQty < 1) return item;
                return { ...item, cartQuantity: newQty };
            }
            return item;
        }));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            await createSale.mutateAsync({
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.cartQuantity
                }))
            });
            message.success('Sale completed successfully!');
            setCart([]);
        } catch (error) {
            // Error handled by interceptor
        }
    };

    return (
        <div style={{ padding: '0 0' }}>
            <Row gutter={24}>
                {/* Product Catalog */}
                <Col span={16}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0 }}>Product Catalog</Title>}
                        extra={
                            <Input 
                                placeholder="Search products..." 
                                prefix={<SearchOutlined />} 
                                style={{ width: 250 }}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        }
                        bodyStyle={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}
                    >
                        <Row gutter={[16, 16]}>
                            {filteredProducts?.map(product => (
                                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                    <Card 
                                        hoverable 
                                        size="small"
                                        onClick={() => addToCart(product)}
                                        style={{ 
                                            opacity: product.stock_quantity === 0 ? 0.6 : 1,
                                            border: product.stock_quantity === 0 ? '1px dashed #d9d9d9' : '1px solid #f0f0f0'
                                        }}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: 8 }}>
                                            <Avatar size={64} icon={<InboxOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1677ff' }} />
                                        </div>
                                        <Card.Meta 
                                            title={product.name} 
                                            description={
                                                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                                    <Text type="secondary" >SKU: {product.sku}</Text>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                                        <Text strong style={{ color: '#1677ff' }}>${product.price.toFixed(2)}</Text>
                                                        <Badge 
                                                            count={product.stock_quantity} 
                                                            showZero 
                                                            style={{ backgroundColor: product.stock_quantity < 10 ? '#ff4d4f' : '#52c41a' }} 
                                                        />
                                                    </div>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                            {filteredProducts?.length === 0 && (
                                <Col span={24}>
                                    <Empty description="No products found" />
                                </Col>
                            )}
                        </Row>
                    </Card>
                </Col>

                {/* Shopping Cart */}
                <Col span={8}>
                    <Card 
                        title={
                            <Space>
                                <ShoppingCartOutlined />
                                <Title level={4} style={{ margin: 0 }}>Shopping Cart</Title>
                                <Badge count={cart.length} offset={[5, 0]} color="#1677ff" />
                            </Space>
                        }
                        style={{ height: 'calc(100vh - 250px)', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflowY: 'auto' }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={cart}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Space.Compact size="small">
                                            <Button icon={<MinusOutlined />} onClick={() => updateCartQuantity(item.id, -1)} />
                                            <Button disabled>{item.cartQuantity}</Button>
                                            <Button icon={<PlusOutlined />} onClick={() => updateCartQuantity(item.id, 1)} />
                                        </Space.Compact>,
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<DeleteOutlined />} 
                                            onClick={() => removeFromCart(item.id)} 
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={`$${(item.price * item.cartQuantity).toFixed(2)}`}
                                    />
                                </List.Item>
                            )}
                            locale={{ emptyText: <Empty description="Cart is empty" /> }}
                        />
                    </Card>

                    <Card style={{ marginTop: 24, background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text >Grand Total:</Text>
                            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
                                ${totalAmount.toFixed(2)}
                            </Title>
                        </div>
                        <Button 
                            type="primary" 
                            size="large" 
                            block 
                            icon={<CheckCircleOutlined />}
                            disabled={cart.length === 0}
                            loading={createSale.isPending}
                            onClick={handleCheckout}
                        >
                            Complete Transaction
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default POSPage;
