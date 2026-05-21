import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
    Users, Package, Award, ArrowUpRight, Clock, 
    CheckCircle, BarChart3, Star, Zap, ChevronRight,
    ArrowRightCircle, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const TruncatedProductInfo = ({ name, maxWidth = '160px', lines = 1, onClick }) => {
    if (!name) return null;
    
    const textStyle = lines === 1 
        ? { maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: onClick ? 'pointer' : 'help' }
        : { maxWidth, display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: onClick ? 'pointer' : 'help', whiteSpace: 'normal', wordBreak: 'break-word' };

    return (
        <div className="product-name-wrapper" onClick={onClick} style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle', maxWidth: '100%' }}>
            <div style={textStyle}>
                {name}
            </div>
            <div className="hover-card">
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--admin-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Reserve Details</span>
                {name}
            </div>
        </div>
    );
};

const Overview = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        stats: [],
        productStats: [],
        topProduct: null,
        charts: { weekly: [], monthly: [] },
        activities: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('weekly');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching overview data:", err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    if (loading) return (
        <div style={{ 
            height: '60vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--admin-text-muted)',
            fontFamily: 'var(--font-heading)'
        }}>
            <div className="animate-spin" style={{ marginBottom: '1rem' }}><Clock size={32} /></div>
            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Gathering Intelligence...</p>
        </div>
    );

    const maxOrders = Math.max(...(data.charts[timeRange]?.map(d => d.orders) || [1]));

    return (
        <div className="overview-page">
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <h2 className="page-title" style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>The Ledger</h2>
                    <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--admin-primary)' }}>
                        Live Intelligence & Performance Metrics
                    </p>
                </motion.div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button className="btn-couture" style={{ marginTop: 0, padding: '0.8rem 1.5rem', width: 'auto', fontSize: '0.65rem' }}>
                        Generate Report
                    </button>
                </div>
            </header>
            
            {/* Top Priority Metrics */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {(data.stats || []).length > 0 ? data.stats.map((stat, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="stat-card"
                        style={{ padding: '2rem', background: index === 0 ? 'var(--admin-primary)' : 'var(--admin-bg-dark)' }}
                    >
                        <span className="stat-label" style={{ color: index === 0 ? 'rgba(0,0,0,0.6)' : 'var(--admin-text-muted)' }}>{stat.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="stat-value" style={{ fontSize: '2rem', color: index === 0 ? '#000' : 'var(--admin-text-main)' }}>{stat.value || '0'}</span>
                            <div className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`} style={{ color: index === 0 ? '#000' : (stat.isUp ? 'var(--admin-success)' : 'var(--admin-danger)') }}>
                                {stat.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span style={{ fontWeight: '600' }}>{stat.trend}</span>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div style={{ color: 'var(--admin-text-muted)', padding: '2rem', gridColumn: '1 / -1', textAlign: 'center', border: '1px dashed var(--admin-border)' }}>
                        No primary metrics available for this period.
                    </div>
                )}
            </div>

            {/* Main Insight Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                {/* Visual Analytics */}
                <div className="activity-card" style={{ padding: '3rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                        <div>
                            <h3 className="section-subtitle" style={{ border: 'none', marginBottom: '0.5rem' }}>Market Velocity</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Order volume trends across the current collection.</p>
                        </div>
                        <div className="range-tabs" style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '4px' }}>
                            {['weekly', 'monthly'].map(range => (
                                <button 
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    style={{
                                        background: timeRange === range ? 'var(--admin-primary)' : 'transparent',
                                        color: timeRange === range ? '#000' : 'var(--admin-text-muted)',
                                        border: 'none',
                                        padding: '0.5rem 1.2rem',
                                        fontSize: '0.65rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        borderRadius: '2px',
                                        fontWeight: timeRange === range ? '700' : '400'
                                    }}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ height: '220px', width: '100%', marginBottom: '2rem', position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--admin-primary)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="var(--admin-primary)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Area Fill */}
                            {(data.charts[timeRange] || []).length > 0 && (
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    d={`
                                        M 0,220
                                        ${(data.charts[timeRange] || []).map((d, i) => {
                                            const total = (data.charts[timeRange] || []).length;
                                            const x = total > 1 ? (i / (total - 1)) * 1000 : 500;
                                            const y = 220 - (d.orders / (maxOrders || 1)) * 180;
                                            return `L ${x},${y}`;
                                        }).join(' ')}
                                        V 220
                                        Z
                                    `}
                                    fill="url(#chartGradient)"
                                />
                            )}

                            {/* Main Line */}
                            {(data.charts[timeRange] || []).length > 0 ? (
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d={(data.charts[timeRange] || []).map((d, i) => {
                                        const total = (data.charts[timeRange] || []).length;
                                        const x = total > 1 ? (i / (total - 1)) * 1000 : 500;
                                        const y = 220 - (d.orders / (maxOrders || 1)) * 180;
                                        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="var(--admin-primary)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ) : (
                                <path d="M 0,220 L 1000,220" stroke="var(--admin-border)" strokeWidth="1" strokeDasharray="5,5" vectorEffect="non-scaling-stroke" />
                            )}

                        </svg>

                        {/* Data Points Overlay (HTML to prevent SVG distortion) */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {(data.charts[timeRange] || []).map((d, i) => {
                                const total = (data.charts[timeRange] || []).length;
                                const leftPercent = total > 1 ? (i / (total - 1)) * 100 : 50;
                                const yValue = 220 - (d.orders / (maxOrders || 1)) * 180;
                                const topPercent = (yValue / 220) * 100;
                                
                                return (
                                    <div key={i} style={{ 
                                        position: 'absolute', 
                                        left: `${leftPercent}%`, 
                                        top: `${topPercent}%`,
                                        transform: 'translate(-50%, -50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1 + i * 0.1 }}
                                            style={{
                                                position: 'absolute',
                                                top: '-25px',
                                                fontSize: '0.7rem',
                                                color: d.orders === maxOrders ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
                                                fontWeight: d.orders === maxOrders ? '700' : '400',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {d.orders}
                                        </motion.div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--admin-bg-dark)',
                                                border: '2px solid var(--admin-primary)'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* X-Axis Labels */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '-25px', 
                            left: 0, 
                            right: 0, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '0 5px'
                        }}>
                            {(data.charts[timeRange] || []).length > 0 ? (
                                (data.charts[timeRange] || []).map((d, i) => (
                                    <span key={i} style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {timeRange === 'weekly' ? d.day : d.date}
                                    </span>
                                ))
                            ) : (
                                <span style={{ width: '100%', textAlign: 'center', fontSize: '0.65rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                                    Awaiting initial order data to map trajectory.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Star Spotlight */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {data.topProduct ? (
                        <div style={{ 
                            background: 'var(--admin-bg-dark)', 
                            padding: '2.5rem', 
                            border: '1px solid var(--admin-border)',
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'var(--admin-primary)', opacity: 0.05 }}>
                                <Award size={100} />
                            </div>
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--admin-primary)', marginBottom: '1.5rem', display: 'block' }}>
                                Highest Velocity
                            </span>
                            
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--admin-text-main)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                                <TruncatedProductInfo 
                                    name={data.topProduct.product_name} 
                                    maxWidth="100%" 
                                    lines={2} 
                                    onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(data.topProduct.product_name)}`)}
                                />
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--admin-primary)' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', display: 'block' }}>Orders Captured</span>
                                    <span style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', fontWeight: '600' }}>{data.topProduct.order_count}</span>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--admin-success)' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', display: 'block' }}>Revenue Contribution</span>
                                    <span style={{ fontSize: '1.2rem', color: 'var(--admin-text-main)', fontWeight: '600' }}>${Number(data.topProduct.total_revenue || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'var(--admin-bg-dark)', 
                            padding: '2.5rem', 
                            border: '1px dashed var(--admin-border)',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'var(--admin-text-muted)',
                            fontStyle: 'italic',
                            fontSize: '0.85rem'
                        }}>
                            Insufficient data to determine a collection leader.
                        </div>
                    )}
                </div>
            </div>

            {/* Secondary Insights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: '2.5rem' }}>
                {/* Performance Table */}
                <div className="activity-card" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 className="section-subtitle" style={{ border: 'none', margin: 0 }}>Collection Performance</h3>
                        <ChevronRight size={20} color="var(--admin-primary)" />
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                <th style={{ padding: '1rem 0', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', textAlign: 'left' }}>Reserve Name</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', textAlign: 'center' }}>Velocity</th>
                                <th style={{ padding: '1rem 0', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--admin-text-muted)', textAlign: 'right' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.productStats || []).length > 0 ? (
                                (data.productStats || []).slice(0, 5).map((prod, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>
                                            <TruncatedProductInfo 
                                                name={prod.product_name} 
                                                maxWidth="180px" 
                                                onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(prod.product_name)}`)}
                                            />
                                        </td>
                                        <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', flex: 1, maxWidth: '60px', borderRadius: '2px', position: 'relative' }}>
                                                    <div style={{ 
                                                        position: 'absolute', top: 0, left: 0, height: '100%', 
                                                        width: `${(prod.order_count / (data.topProduct?.order_count || 1)) * 100}%`,
                                                        background: 'var(--admin-primary)', borderRadius: '2px'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem' }}>{prod.order_count}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', color: 'var(--admin-primary)', textAlign: 'right', fontWeight: '600' }}>
                                            ${Number(prod.total_revenue).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                        No performance data available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Activity Feed */}
                <div className="activity-card" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 className="section-subtitle" style={{ border: 'none', margin: 0 }}>Recent Acquisitions</h3>
                        <Activity size={18} color="var(--admin-primary)" />
                    </div>
                    <div className="activity-list">
                        {(data.activities || []).length > 0 ? (
                            (data.activities || []).slice(0, 6).map(activity => (
                                <div key={activity.id} className="activity-item" style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '40px', height: '40px', borderRadius: '4px', 
                                                background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--admin-primary)', border: '1px solid rgba(212,175,55,0.1)', overflow: 'hidden'
                                            }}>
                                                {activity.image ? (
                                                    <img src={activity.image} alt={activity.product} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ShoppingBag size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)', margin: '0 0 4px 0' }}>
                                                    <TruncatedProductInfo 
                                                        name={activity.product} 
                                                        maxWidth="200px" 
                                                        onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(activity.product)}`)}
                                                    />
                                                </h4>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                                                    <span 
                                                        onClick={() => navigate(`/admin/dashboard/customer/${encodeURIComponent(activity.user)}`)}
                                                        style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
                                                    >
                                                        {activity.user}
                                                    </span> — Order #{activity.id}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                                            {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem 0', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                The ledger is currently awaiting new acquisitions.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .overview-page {
                    animation: fadeIn 0.8s ease-out;
                    max-width: 1600px;
                    margin: 0 auto;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .stat-card {
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
                .activity-card {
                    background: var(--admin-bg-dark);
                    border: 1px solid var(--admin-border);
                }
                table tr:hover {
                    background-color: rgba(255,255,255,0.01);
                }
                .product-name-wrapper .hover-card {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    background: var(--admin-bg-dark);
                    border: 1px solid var(--admin-primary);
                    color: var(--admin-text-main);
                    padding: 1rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    font-family: var(--font-main);
                    white-space: normal;
                    width: max-content;
                    max-width: 250px;
                    z-index: 50;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    pointer-events: none;
                    margin-bottom: 8px;
                    transform: translateY(5px);
                }
                .product-name-wrapper:hover .hover-card {
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0);
                }
            `}} />
        </div>
    );
};

export default Overview;
