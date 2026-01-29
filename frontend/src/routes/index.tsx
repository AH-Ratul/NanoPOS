import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import POSPage from '../pages/POSPage';


const RootLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <MainLayout />,
                        children: [
                            {
                                path: '/',
                                element: <Navigate to="/pos" replace />,
                            },
                            {
                                path: '/dashboard',
                                element: <DashboardPage />,
                            },
                            {
                                path: '/pos',
                                element: <POSPage />,
                            },
                            {
                                path: '/inventory',
                                element: <InventoryPage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: <Navigate to="/login" replace />,
            },
        ],
    },
]);
