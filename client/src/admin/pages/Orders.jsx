import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, X, Phone, MapPin, Package, Calendar, DollarSign, Users, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../user/context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`/api/orders/${id}/status`, { status });
            showNotification(`Acquisition #${id} marked as ${status}`, 'success');
            setSelectedOrder(null);
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification("Failed to update acquisition status", "error");
        }
    };

    const filteredOrders = orders.filter(order => 
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_whatsapp?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="products-page">
            <div className="title-section">
                <h2 className="page-title">Client Intelligence</h2>
                <p>Detailed overview of acquisitions and logistics.</p>
            </div>
            
            <div className="form-container" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 className="section-subtitle" style={{ border: 'none', margin: 0, padding: 0 }}>
                        Current Orders
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--admin-text-muted)', marginLeft: '1rem' }}>
                            {filteredOrders.length} {filteredOrders.length === 1 ? 'ACQUISITION' : 'ACQUISITIONS'}
                        </span>
                    </h3>
                    
                    <div className="chic-input-group" style={{ margin: 0, width: '300px' }}>
                        <Search className="input-icon" size={18} />
                        <input 
                            type="text" 
                            className="chic-input" 
                            placeholder="Search by name or WhatsApp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.75rem 0 0.75rem 2.5rem' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Syncing with database...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-gallery" style={{ minHeight: '250px' }}>
                        <div className="empty-gallery-content">
                            <ShoppingBag size={32} style={{ color: 'var(--admin-primary)', marginBottom: '1rem' }} />
                            <p style={{ fontSize: '1.2rem' }}>No acquisition records found.</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--admin-text-main)' }}>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>ID</th>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>Client</th>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>WhatsApp</th>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>Total</th>
                                    <th style={{ padding: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr 
                                        key={order.id} 
                                        onClick={() => setSelectedOrder(order)}
                                        style={{ 
                                            borderBottom: '1px solid var(--admin-border)', 
                                            transition: 'all 0.3s',
                                            cursor: 'pointer'
                                        }} 
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(201, 160, 80, 0.05)'} 
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '1rem', color: 'var(--admin-primary)', fontWeight: '600' }}>#{order.id}</td>
                                        <td style={{ padding: '1rem', color: 'var(--admin-text-main)' }}>
                                            <span 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/dashboard/customer/${encodeURIComponent(order.customer_name)}`); }} 
                                                style={{ cursor: 'pointer', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '2px' }}
                                            >
                                                {order.customer_name}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>{order.customer_whatsapp}</td>
                                        <td style={{ padding: '1rem', color: 'var(--admin-text-main)' }}>
                                            <span 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/dashboard/product/${encodeURIComponent(order.product_name)}`); }} 
                                                style={{ cursor: 'pointer', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '2px' }}
                                            >
                                                {order.product_name}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--admin-primary)', fontWeight: '600' }}>${order.total_price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '20px', 
                                                fontSize: '0.7rem', 
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'var(--admin-text-main)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(8px)'
                    }} onClick={() => setSelectedOrder(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="order-detail-card fashion-modal"
                            style={{
                                background: 'var(--admin-bg-card)',
                                color: 'var(--admin-text-main)',
                                width: '90%',
                                maxWidth: '850px',
                                maxHeight: '85vh',
                                overflowY: 'auto',
                                border: '1px solid var(--admin-border)',
                                position: 'relative',
                                padding: '4rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="modal-close-chic"
                                style={{
                                    position: 'absolute',
                                    top: '2rem',
                                    right: '2rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--admin-text-muted)',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s'
                                }}
                            >
                                <X size={24} />
                            </button>

                            <div className="modal-inner-layout" style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1.2', minWidth: '320px' }}>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                background: 'var(--admin-primary)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                boxShadow: '0 0 20px rgba(201, 160, 80, 0.3)'
                                            }}>
                                                <ShoppingBag size={24} color="black" />
                                            </div>
                                            <h2 style={{ 
                                                fontFamily: 'var(--font-heading)', 
                                                fontSize: '1.8rem', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '3px',
                                                margin: 0,
                                                color: 'var(--admin-text-main)'
                                            }}>Order #{selectedOrder.id}</h2>
                                        </div>
                                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: '4.2rem' }}>
                                            Validated on {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="fashion-detail-section" style={{ marginBottom: '3rem' }}>
                                        <h3 style={{ 
                                            fontSize: '0.7rem', 
                                            color: 'var(--admin-primary)', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '3px', 
                                            marginBottom: '2rem', 
                                            borderBottom: '1px solid var(--admin-border)', 
                                            paddingBottom: '0.75rem',
                                            fontWeight: '700'
                                        }}>Client Intelligence</h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <Users size={16} color="var(--admin-primary)" opacity={0.7} />
                                                <span 
                                                    onClick={() => { setSelectedOrder(null); navigate(`/admin/dashboard/customer/${encodeURIComponent(selectedOrder.customer_name)}`); }}
                                                    style={{ fontSize: '0.95rem', letterSpacing: '0.5px', color: 'var(--admin-text-main)', cursor: 'pointer', borderBottom: '1px solid rgba(212,175,55,0.3)' }}
                                                >
                                                    {selectedOrder.customer_name}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <Phone size={16} color="var(--admin-primary)" opacity={0.7} />
                                                <a href={`https://wa.me/${selectedOrder.customer_whatsapp}`} target="_blank" rel="noreferrer" style={{ 
                                                    color: 'var(--admin-primary)', 
                                                    textDecoration: 'none',
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600',
                                                    borderBottom: '1px solid var(--admin-primary)'
                                                }}>
                                                    {selectedOrder.customer_whatsapp}
                                                </a>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                                                <MapPin size={16} color="var(--admin-primary)" opacity={0.7} style={{ marginTop: '0.3rem' }} />
                                                <span style={{ color: 'var(--admin-text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                                                    {selectedOrder.customer_address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="fashion-detail-section">
                                        <h3 style={{ 
                                            fontSize: '0.7rem', 
                                            color: 'var(--admin-primary)', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '3px', 
                                            marginBottom: '2rem', 
                                            borderBottom: '1px solid var(--admin-border)', 
                                            paddingBottom: '0.75rem',
                                            fontWeight: '700'
                                        }}>Acquisition Summary</h3>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Selection</span>
                                                <span 
                                                    onClick={() => { setSelectedOrder(null); navigate(`/admin/dashboard/product/${encodeURIComponent(selectedOrder.product_name)}`); }}
                                                    style={{ textAlign: 'right', maxWidth: '200px', fontSize: '0.9rem', color: 'var(--admin-text-main)', cursor: 'pointer', borderBottom: '1px solid rgba(212,175,55,0.3)' }}
                                                >
                                                    {selectedOrder.product_name}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Variant</span>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>{selectedOrder.weight || 'Standard'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Quantity</span>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>{selectedOrder.quantity} Unit(s)</span>
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                marginTop: '1.5rem', 
                                                paddingTop: '1.5rem', 
                                                borderTop: '1px dashed var(--admin-border)' 
                                            }}>
                                                <span style={{ color: 'var(--admin-text-main)', fontWeight: '700', letterSpacing: '1px', fontSize: '0.9rem' }}>TOTAL INVESTMENT</span>
                                                <span style={{ color: 'var(--admin-primary)', fontWeight: '800', fontSize: '1.4rem' }}>${selectedOrder.total_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-right-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ 
                                        width: '100%', 
                                        aspectRatio: '1/1', 
                                        border: '1px solid var(--admin-border)',
                                        padding: '1.5rem',
                                        background: 'var(--admin-glass)',
                                        borderRadius: '4px'
                                    }}>
                                        {selectedOrder.image_url ? (
                                            <img 
                                                src={selectedOrder.image_url} 
                                                alt={selectedOrder.product_name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
                                                <Package size={48} opacity={0.1} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="logistics-card-chic" style={{ 
                                        background: 'var(--admin-glass)', 
                                        padding: '2rem', 
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: '4px'
                                    }}>
                                        <h4 style={{ fontSize: '0.65rem', color: 'var(--admin-primary)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px', fontWeight: '700' }}>Logistics Status</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                            <div style={{ 
                                                width: '8px', 
                                                height: '8px', 
                                                borderRadius: '50%', 
                                                background: selectedOrder.status === 'confirmed' ? 'var(--admin-success)' : selectedOrder.status === 'rejected' ? 'var(--admin-danger)' : 'var(--admin-primary)', 
                                                boxShadow: `0 0 10px ${selectedOrder.status === 'confirmed' ? 'var(--admin-success)' : selectedOrder.status === 'rejected' ? 'var(--admin-danger)' : 'var(--admin-primary)'}` 
                                            }}></div>
                                            <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: '600', color: 'var(--admin-text-main)' }}>{selectedOrder.status}</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                                                className="fashion-button-chic" 
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '1rem',
                                                    background: 'var(--admin-primary)',
                                                    border: '1px solid var(--admin-primary)',
                                                    color: 'black',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.7rem',
                                                    letterSpacing: '2px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Check size={16} /> Confirm Acquisition
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedOrder.id, 'rejected')}
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '1rem',
                                                    background: 'none',
                                                    border: '1px solid var(--admin-danger)',
                                                    color: 'var(--admin-danger)',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.7rem',
                                                    letterSpacing: '2px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Trash2 size={16} /> Reject Acquisition
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
