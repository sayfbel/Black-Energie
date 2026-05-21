import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ProductStats = () => {
    const { productName } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/admin/product/${encodeURIComponent(productName)}`, {
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
    }, [productName, navigate]);

    if (loading) return <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '5rem' }}>Gathering Intelligence...</div>;
    if (!data) return <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '5rem' }}>Data not found.</div>;

    const { statusStats, bestCustomer, productInfo } = data;
    
    // Process stats
    let totalRevenue = 0;
    let totalOrders = 0;
    let pending = 0;
    let valid = 0;
    let invalid = 0;

    (statusStats || []).forEach(stat => {
        totalOrders += stat.count;
        totalRevenue += Number(stat.total_revenue || 0);
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
                {productInfo?.image_url ? (
                    <img src={productInfo.image_url} alt={productName} style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg-dark)', padding: '10px' }} />
                ) : (
                    <div style={{ width: '120px', height: '120px', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                        <Package size={40} color="var(--admin-primary)" opacity={0.3} />
                    </div>
                )}
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--admin-text-main)', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{productName}</h2>
                    <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--admin-primary)', margin: 0 }}>
                        Product Analytics Profile
                    </p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ padding: '2rem', background: 'var(--admin-primary)', color: '#000', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Total Revenue</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', marginTop: '0.5rem' }}>${totalRevenue.toLocaleString()}</div>
                </div>
                <div style={{ padding: '2rem', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Total Orders</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--admin-text-main)', marginTop: '0.5rem' }}>{totalOrders}</div>
                </div>
                <div style={{ padding: '2rem', background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--admin-text-muted)' }}>Best Customer</span>
                    <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', marginTop: '0.5rem', wordBreak: 'break-word' }}>
                        {bestCustomer ? (
                            <span onClick={() => navigate(`/admin/dashboard/customer/${encodeURIComponent(bestCustomer.customer_name)}`)} style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--admin-primary)', textUnderlineOffset: '4px' }}>
                                {bestCustomer.customer_name}
                            </span>
                        ) : <span style={{ fontStyle: 'italic', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>No data</span>}
                    </div>
                </div>
            </div>

            <div style={{ background: 'var(--admin-bg-dark)', border: '1px solid var(--admin-border)', padding: '3rem', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', marginBottom: '2rem', fontWeight: '400', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>Order Status Distribution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                    <div style={{ borderLeft: '2px solid var(--admin-primary)', paddingLeft: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                            <Clock size={16} /> <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending</span>
                        </div>
                        <div style={{ fontSize: '2rem', color: 'var(--admin-text-main)' }}>{pending}</div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--admin-success)', paddingLeft: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                            <CheckCircle size={16} color="var(--admin-success)" /> <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Valid</span>
                        </div>
                        <div style={{ fontSize: '2rem', color: 'var(--admin-text-main)' }}>{valid}</div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--admin-danger)', paddingLeft: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                            <AlertCircle size={16} color="var(--admin-danger)" /> <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Non Valid</span>
                        </div>
                        <div style={{ fontSize: '2rem', color: 'var(--admin-text-main)' }}>{invalid}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductStats;
