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
    const [hoveredIndex, setHoveredIndex] = useState(null);

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
                                    onClick={() => {
                                        setTimeRange(range);
                                        setHoveredIndex(null);
                                    }}
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

                    {(() => {
                        const chartData = data.charts[timeRange] || [];
                        const maxVal = Math.max(...(chartData.map(d => d.orders) || []), 1);
                        const points = chartData.map((d, i) => {
                            const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 1000 : 500;
                            const y = 190 - (d.orders / maxVal) * 140; // beautiful 30px top margin and 30px bottom margin
                            return { x, y, orders: d.orders, label: timeRange === 'weekly' ? d.day : d.date };
                        });

                        const getSplinePath = (pts) => {
                            if (pts.length === 0) return '';
                            let path = `M ${pts[0].x},${pts[0].y}`;
                            for (let i = 1; i < pts.length; i++) {
                                const p0 = pts[i - 1];
                                const p1 = pts[i];
                                const cp1x = p0.x + (p1.x - p0.x) / 3;
                                const cp1y = p0.y;
                                const cp2x = p1.x - (p1.x - p0.x) / 3;
                                const cp2y = p1.y;
                                path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
                            }
                            return path;
                        };

                        const linePath = getSplinePath(points);
                        const areaPath = points.length > 0 ? `${linePath} V 220 H ${points[0].x} Z` : '';

                        const handleMouseMove = (e) => {
                            if (points.length === 0) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clientX = e.clientX - rect.left;
                            const percent = clientX / rect.width;
                            const index = Math.min(Math.max(Math.round(percent * (points.length - 1)), 0), points.length - 1);
                            setHoveredIndex(index);
                        };

                        const handleMouseLeave = () => {
                            setHoveredIndex(null);
                        };

                        return (
                            <div 
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{ height: '220px', width: '100%', marginBottom: '2.5rem', position: 'relative', cursor: 'crosshair' }}
                            >
                                <svg width="100%" height="100%" viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--admin-primary)" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="var(--admin-primary)" stopOpacity="0.0" />
                                        </linearGradient>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="var(--admin-primary)" floodOpacity="0.3"/>
                                        </filter>
                                    </defs>

                                    {/* Horizontal Gridlines & Y labels */}
                                    {points.length > 0 && [0, 0.5, 1].map((ratio, idx) => {
                                        const yVal = 190 - ratio * 140;
                                        const labelVal = Math.round(ratio * maxVal);
                                        return (
                                            <g key={idx}>
                                                <line 
                                                    x1="0" 
                                                    y1={yVal} 
                                                    x2="1000" 
                                                    y2={yVal} 
                                                    stroke="rgba(255, 255, 255, 0.04)" 
                                                    strokeWidth="1"
                                                />
                                                <text 
                                                    x="1000" 
                                                    y={yVal - 6} 
                                                    fill="var(--admin-text-muted)" 
                                                    fontSize="9" 
                                                    fontWeight="500"
                                                    textAnchor="end"
                                                    letterSpacing="1"
                                                    opacity="0.4"
                                                >
                                                    {labelVal} {labelVal === 1 ? 'order' : 'orders'}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Area Fill */}
                                    {areaPath && (
                                        <motion.path
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8 }}
                                            d={areaPath}
                                            fill="url(#chartGradient)"
                                        />
                                    )}

                                    {/* Main Line with Glow Filter */}
                                    {linePath ? (
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.2, ease: "easeInOut" }}
                                            d={linePath}
                                            fill="none"
                                            stroke="var(--admin-primary)"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                            filter="url(#glow)"
                                        />
                                    ) : (
                                        <path d="M 0,220 L 1000,220" stroke="var(--admin-border)" strokeWidth="1" strokeDasharray="5,5" vectorEffect="non-scaling-stroke" />
                                    )}

                                    {/* Vertical Hover Guide Line */}
                                    {hoveredIndex !== null && points[hoveredIndex] && (
                                        <line 
                                            x1={points[hoveredIndex].x} 
                                            y1={30} 
                                            x2={points[hoveredIndex].x} 
                                            y2={220} 
                                            stroke="var(--admin-primary)" 
                                            strokeWidth="1.5" 
                                            strokeDasharray="4,4" 
                                            opacity="0.3"
                                        />
                                    )}

                                    {/* Elegant Order Position Markers (Circles) */}
                                    {points.map((pt, idx) => {
                                        const isHovered = hoveredIndex === idx;
                                        return (
                                            <g key={idx} style={{ pointerEvents: 'none' }}>
                                                {/* Outer golden halo */}
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r={isHovered ? 12 : 5} 
                                                    fill="var(--admin-primary)" 
                                                    opacity={isHovered ? 0.25 : 0.15}
                                                    style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                                />
                                                {/* Crisp card-colored circle body with primary stroke */}
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r={isHovered ? 7.5 : 4.5} 
                                                    fill="var(--admin-bg-card)" 
                                                    stroke="var(--admin-primary)" 
                                                    strokeWidth={isHovered ? 2.5 : 1.8}
                                                    style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                                />
                                                {/* Main text colored core */}
                                                <circle 
                                                    cx={pt.x} 
                                                    cy={pt.y} 
                                                    r={isHovered ? 3.5 : 2} 
                                                    fill="var(--admin-text-main)" 
                                                    style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                                />
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Pixel-Perfect X-Axis Labels */}
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: '-25px', 
                                    left: 0, 
                                    right: 0, 
                                    height: '20px',
                                    pointerEvents: 'none'
                                }}>
                                    {points.length > 0 ? (
                                        points.map((pt, i) => {
                                            const showLabel = timeRange === 'weekly' || i % 5 === 0 || i === points.length - 1;
                                            if (!showLabel) return null;
                                            
                                            return (
                                                <span 
                                                    key={i} 
                                                    style={{ 
                                                        position: 'absolute',
                                                        left: `${(pt.x / 1000) * 100}%`,
                                                        transform: i === 0 
                                                            ? 'none' 
                                                            : i === points.length - 1 
                                                                ? 'translateX(-100%)' 
                                                                : 'translateX(-50%)',
                                                        fontSize: '0.65rem', 
                                                        color: 'var(--admin-text-muted)', 
                                                        textTransform: 'uppercase', 
                                                        letterSpacing: '1px',
                                                        whiteSpace: 'nowrap',
                                                        transition: 'left 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                                                    }}
                                                >
                                                    {pt.label}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: '0.65rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                                            Awaiting initial order data to map trajectory.
                                        </span>
                                    )}
                                </div>

                                {/* Floating Tooltip Card */}
                                {hoveredIndex !== null && points[hoveredIndex] && (
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            left: `${(points[hoveredIndex].x / 1000) * 100}%`,
                                            top: `${(points[hoveredIndex].y / 220) * 100 - 15}%`,
                                            transform: hoveredIndex > points.length - 3 
                                                ? 'translate(-108%, -100%)' 
                                                : hoveredIndex < 2 
                                                    ? 'translate(8%, -100%)' 
                                                    : 'translate(-50%, -100%)',
                                            zIndex: 100,
                                            pointerEvents: 'none',
                                            transition: 'left 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                        }}
                                    >
                                        <div className="chart-tooltip">
                                            <div style={{ 
                                                fontSize: '0.6rem', 
                                                color: 'var(--admin-text-muted)', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '1.5px',
                                                marginBottom: '6px',
                                                fontWeight: '600'
                                            }}>
                                                {points[hoveredIndex].label}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '6px', 
                                                    height: '6px', 
                                                    borderRadius: '50%', 
                                                    background: 'var(--admin-primary)', 
                                                    boxShadow: '0 0 8px var(--admin-primary)' 
                                                }} />
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                                                    {points[hoveredIndex].orders} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--admin-text-muted)' }}>{points[hoveredIndex].orders === 1 ? 'Order' : 'Orders'}</span>
                                                </div>
                                            </div>
                                            <div className="chart-tooltip-divider">
                                                <Zap size={10} />
                                                <span>Est. Volatility Stable</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
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
                .chart-tooltip {
                    background: rgba(10, 10, 10, 0.95);
                    border: 1px solid var(--admin-primary);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.85), inset 0 0 10px rgba(212, 175, 55, 0.05);
                    border-radius: 4px;
                    padding: 1rem 1.2rem;
                    color: var(--admin-text-main);
                    font-family: var(--font-body, sans-serif);
                    min-width: 150px;
                    backdrop-filter: blur(10px);
                    transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                body.light-mode .chart-tooltip {
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid var(--admin-primary);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(212, 175, 55, 0.02);
                }
                .chart-tooltip-divider {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    margin-top: 8px;
                    padding-top: 8px;
                    font-size: 0.65rem;
                    color: var(--admin-success);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                body.light-mode .chart-tooltip-divider {
                    border-top: 1px solid rgba(0, 0, 0, 0.08);
                }
            `}} />
        </div>
    );
};

export default Overview;
