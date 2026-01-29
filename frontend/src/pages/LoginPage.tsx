import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/instance';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response: any = await api.post('/auth/login', values);
            login(response.data);
            message.success('Login successful!');
            navigate('/pos');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const demo = async () => {
        const demoCredentials = {
            email: 'admin@email.com',
            password: '123456',
        };

        form.setFieldsValue(demoCredentials);
        await form.validateFields();
        onFinish(demoCredentials);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>NanoPOS</Title>
                    <Text type="secondary">Sign in to your account</Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="default" disabled={loading} onClick={demo} block>
                    Demo Login
                </Button>
            </Card>

        </div>
    );
};

export default LoginPage;
