import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';

const CustomerStats = () => {
    const { customerName } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/admin/customer/${encodeURIComponent(customerName)}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [customerName, navigate]);

    if (loading) return <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '5rem' }}>Gathering Intelligence...</div>;
    if (!data) return <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '5rem' }}>Data not found.</div>;

    const { statusStats, biggestOrder, orderHistory } = data;
    
    // Process stats
    let totalSpent = 0;
    let totalOrders = 0;
    let pending = 0;
    let valid = 0;
    let invalid = 0;

    (statusStats || []).forEach(stat => {
        totalOrders += stat.count;
        totalSpent += Number(stat.total_spent || 0);
        if (stat.status === 'pending') pending += stat.count;
        if (stat.status === 'confirmed') valid += stat.count;
        if (stat.status === 'cancelled') invalid += stat.count;
    });

    return (
        <div style={{ animation: 'fadeIn 0.8s ease-out', maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}>
                <ArrowLeft size={16} /> Back
            </button>

            <header style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '4rem' }}>
                <div style={{ width: '120px', height: '120px', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <User size={50} color="var(--admin-primary)" opacity={0.5} />
                </div>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', margin: '0 0 0.5rem 0' }}>{customerName}</h2>
                    <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--admin-primary)', margin: 0 }}>
                        Client Intelligence Profile
                    </p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ padding: '2rem', background: 'var(--admin-primary)', color: '#000', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Total Value (LTV)</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', marginTop: '0.5rem' }}>${totalSpent.toLocaleString()}</div>
                </div>
                <div style={{ padding: '2rem', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Total Orders</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--admin-text-main)', marginTop: '0.5rem' }}>{totalOrders}</div>
                </div>
                <div style={{ padding: '2rem', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Largest Acquisition</span>
                    <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', marginTop: '0.5rem', wordBreak: 'break-word' }}>
                        {biggestOrder ? (
                            <>
                                <span style={{ display: 'block', color: 'var(--admin-primary)', fontWeight: '600', fontSize: '1.5rem' }}>${Number(biggestOrder.total_price).toLocaleString()}</span>
                                <span onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(biggestOrder.product_name)}`)} style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                                    {biggestOrder.product_name}
                                </span>
                            </>
                        ) : <span style={{ fontStyle: 'italic', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>No data</span>}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <div style={{ background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', padding: '3rem', borderRadius: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', marginBottom: '2rem', fontWeight: '400', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>Order Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                <Clock size={18} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Pending</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)' }}>{pending}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--admin-success)' }}>
                                <CheckCircle size={18} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Valid</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)' }}>{valid}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--admin-danger)' }}>
                                <AlertCircle size={18} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Non Valid</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)' }}>{invalid}</div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', padding: '3rem', borderRadius: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', marginBottom: '2rem', fontWeight: '400', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>Acquisition History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                        {(orderHistory || []).map(order => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--admin-primary)', opacity: 0.5 }}><ShoppingBag size={20} /></div>
                                    <div>
                                        <div onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(order.product_name)}`)} style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--admin-text-main)', marginBottom: '4px', textDecoration: 'underline', textDecorationColor: 'rgba(212,175,55,0.3)', textUnderlineOffset: '2px' }}>
                                            {order.product_name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                                            {new Date(order.created_at).toLocaleDateString()} — #{order.id}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--admin-primary)', fontWeight: '600' }}>${Number(order.total_price).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: order.status === 'confirmed' ? 'var(--admin-success)' : order.status === 'cancelled' ? 'var(--admin-danger)' : 'var(--admin-text-muted)' }}>{order.status}</div>
                                </div>
                            </div>
                        ))}
                        {(orderHistory || []).length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.8rem', padding: '2rem 0', fontStyle: 'italic' }}>No order history.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerStats;
