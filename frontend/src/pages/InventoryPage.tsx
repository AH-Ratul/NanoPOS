import React, { useState } from 'react';
import { 
    Typography, 
    Table, 
    Button, 
    Space, 
    Modal, 
    Form, 
    Input, 
    InputNumber, 
    Popconfirm, 
    message 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import type { Product } from '../hooks/useProducts';

const { Title } = Typography;

const InventoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

    const { data: products, isLoading } = useProducts();
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            if (editingProduct) {
                await updateProduct.mutateAsync({ id: editingProduct.id, ...values });
                message.success('Product updated successfully');
            } else {
                await createProduct.mutateAsync(values);
                message.success('Product created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            // Error handled by interceptor
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct.mutateAsync(id);
            message.success('Product deleted successfully');
        } catch (error) {
            // Error handled by interceptor
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: (a: Product, b: Product) => a.price - b.price,
        },
        {
            title: 'Stock',
            dataIndex: 'stock_quantity',
            key: 'stock',
            sorter: (a: Product, b: Product) => a.stock_quantity - b.stock_quantity,
            render: (stock: number) => (
                <span style={{ color: stock < 10 ? '#cf1322' : 'inherit', fontWeight: stock < 10 ? 'bold' : 'normal' }}>
                    {stock}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Button 
                        type="text" 
                        icon={<EditOutlined style={{ color: '#1677ff' }} />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete product"
                        description="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="text" 
                            icon={<DeleteOutlined style={{ color: '#cf1322' }} />} 
                            danger 
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Inventory Management</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}
                    size="large"
                >
                    Add Product
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={createProduct.isPending || updateProduct.isPending}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ stock_quantity: 0, price: 0 }}
                >
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="e.g. Wireless Mouse" />
                    </Form.Item>

                    <Form.Item
                        name="sku"
                        label="SKU"
                        rules={[{ required: true, message: 'Please enter SKU' }]}
                    >
                        <Input placeholder="e.g. W-MOUSE-001" disabled={!!editingProduct} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price ($)"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} precision={2} />
                    </Form.Item>

                    <Form.Item
                        name="stock_quantity"
                        label="Stock Quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} precision={0} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryPage;
