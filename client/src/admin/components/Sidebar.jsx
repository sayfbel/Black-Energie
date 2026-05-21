import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Box, LogOut, X, Tag, Truck } from 'lucide-react';
import '../css/dashboard.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="brand-logo">
                    <h1 className="logo-text">Black</h1>
                    <p className="logo-text">Energie</p>
                </div>
                {isOpen && (
                    <button className="mobile-close-btn" onClick={closeSidebar}>
                        <X size={24} />
                    </button>
                )}
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard/overview" className="nav-item" onClick={closeSidebar}>
                    <LayoutDashboard size={20} />
                    <span className="nav-text">Overview</span>
                </NavLink>
                <NavLink to="/admin/dashboard/orders" className="nav-item" onClick={closeSidebar}>
                    <ShoppingBag size={20} />
                    <span className="nav-text">Orders</span>
                </NavLink>
                <NavLink to="/admin/dashboard/products" className="nav-item" onClick={closeSidebar}>
                    <Box size={20} />
                    <span className="nav-text">Products</span>
                </NavLink>
                <NavLink to="/admin/dashboard/offers" className="nav-item" onClick={closeSidebar}>
                    <Tag size={20} />
                    <span className="nav-text">Offers</span>
                </NavLink>
                <NavLink to="/admin/dashboard/delivery" className="nav-item" onClick={closeSidebar}>
                    <Truck size={20} />
                    <span className="nav-text">Delivery</span>
                </NavLink>
            </nav>
            
            <button className="logout-btn" onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
            }}>
                <LogOut size={20} />
                <span className="nav-text">Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
