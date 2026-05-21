import React, { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="notification-container">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 50, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`notification-item ${n.type}`}
                        >
                            <div className="notification-content">
                                {n.type === 'success' && <CheckCircle size={18} className="icon" />}
                                {n.type === 'error' && <AlertCircle size={18} className="icon" />}
                                {n.type === 'info' && <Info size={18} className="icon" />}
                                <span className="message">{n.message}</span>
                            </div>
                            <button onClick={() => removeNotification(n.id)} className="close-btn">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <style>{`
                .notification-container {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    pointer-events: none;
                }
                .notification-item {
                    pointer-events: auto;
                    background: #000;
                    color: #fff;
                    padding: 1rem 1.5rem;
                    min-width: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .notification-item.success {
                    border-left: 4px solid #c9a050;
                }
                .notification-item.error {
                    border-left: 4px solid #ff4444;
                }
                .notification-item.info {
                    border-left: 4px solid #fff;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .icon {
                    color: #c9a050;
                }
                .notification-item.error .icon {
                    color: #ff4444;
                }
                .notification-item.info .icon {
                    color: #fff;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                    padding: 0;
                    margin-left: 1rem;
                    transition: color 0.3s;
                }
                .close-btn:hover {
                    color: #fff;
                }
                .message {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
        </NotificationContext.Provider>
    );
};
