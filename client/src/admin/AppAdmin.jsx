import React from 'react';
import './css/admin.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Offers from './pages/Offers';
import Delivery from './pages/Delivery';
import ProductStats from './pages/ProductStats';
import CustomerStats from './pages/CustomerStats';

// Protected Route Component for Admin
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
};

const AppAdmin = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="verify" element={<VerifyOTP />} />
            
            <Route 
                path="dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                } 
            >
                {/* Default route redirects to overview */}
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
                <Route path="offers" element={<Offers />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="product/:productName" element={<ProductStats />} />
                <Route path="customer/:customerName" element={<CustomerStats />} />
            </Route>

            {/* Catch-all for /admin/* -> redirect to login */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
    );
};

export default AppAdmin;
