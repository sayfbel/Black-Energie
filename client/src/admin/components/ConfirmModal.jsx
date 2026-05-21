import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="mobile-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="form-container" 
                    style={{ width: '90%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center' }}
                >
                    <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.5rem', color: 'var(--admin-text-main)', marginBottom: '1rem' }}>
                        {title}
                    </h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                        {message}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                            onClick={onCancel}
                            className="btn-couture"
                            style={{ margin: 0, padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--admin-text-main)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)' }}
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="btn-couture"
                            style={{ margin: 0, padding: '0.75rem 1.5rem', backgroundColor: 'var(--admin-danger)', color: '#fff', border: '1px solid var(--admin-danger)' }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
