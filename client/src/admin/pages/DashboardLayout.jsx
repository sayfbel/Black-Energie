import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X, Sun, Moon } from 'lucide-react';
import '../css/dashboard.css';

const DashboardLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const location = useLocation();
    
    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.body.classList.add('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };
    
    // Create breadcrumb from path
    const pathParts = location.pathname.split('/').filter(Boolean);
    const displayPath = `admin / ${pathParts[pathParts.length - 1] || 'dashboard'}`;

    return (
        <div className="admin-layout">
            <Sidebar isOpen={isMobileOpen} closeSidebar={() => setIsMobileOpen(false)} />
            
            {/* Overlay for mobile when sidebar is open */}
            {isMobileOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}></div>
            )}
            
            <main className="main-content">
                <header className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button 
                            className="mobile-menu-btn" 
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="breadcrumb">
                            Admin / <span>{pathParts[pathParts.length - 1] || 'Dashboard'}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={toggleTheme} 
                        style={{ background: 'none', border: 'none', color: 'var(--admin-text-main)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-glass)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>
                
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
