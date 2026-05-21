import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, CheckCircle, Clock, XCircle, MapPin, Phone, Package, ArrowLeft, ShieldCheck, Truck, Download, QrCode, FileUp, Loader2 } from 'lucide-react';
import { generatePremiumPDF } from '../utils/pdfGenerator';
import { generateLocalQRCode as generateQRCode } from '../utils/qrGenerator';
import { useLanguage } from '../context/LanguageContext';

const OrderTracker = () => {
    const { t } = useLanguage();
    const { orderId } = useParams();
    const [searchId, setSearchId] = useState(orderId || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [qrCodeBase64, setQrCodeBase64] = useState('');
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [scanning, setScanning] = useState(false);
    
    const fileInputRef = useRef(null);

    const maskPhone = (phone) => {
        if (!phone) return '';
        const str = phone.toString().trim();
        if (str.length <= 5) return str;
        return str.substring(0, 3) + '*******' + str.substring(str.length - 2);
    };

    const maskAddress = (address) => {
        if (!address) return '';
        const parts = address.trim().split(/\s+/);
        if (parts.length < 3) return address;
        const first = parts.slice(0, 3).join(' ');
        const last = parts[parts.length - 1];
        return `${first} ************* ${last}`;
    };

    const fetchOrder = async (id) => {
        if (!id) return;
        const cleanId = id.toString().replace('#', '').trim();
        if (!cleanId) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/orders/${cleanId}`);
            setOrder(res.data);
            
            const trackingUrl = `${window.location.origin}/track/${res.data.id}`;
            const qr = await generateQRCode(trackingUrl);
            setQrCodeBase64(qr);
        } catch (err) {
            console.error("Order search error:", err);
            setError(t('tracker.errorNotFound'));
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!order) return;
        setGeneratingPDF(true);
        try {
            await generatePremiumPDF('acquisition-ticket', `Black_Energie_Reserve_${order.id}.pdf`);
        } catch (err) {
            console.error("PDF Export Error:", err);
        } finally {
            setGeneratingPDF(false);
        }
    };

    const handleFileScan = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);
        setOrder(null);
        setError(null);

        // Simulated high-end scanning logic
        // In a real scenario, we'd use a QR reader library or OCR
        // For this UX, we'll simulate the "intelligence gathering" process
        setTimeout(() => {
            // Simulate finding an ID in the "scanned" file name or metadata
            // Or just prompt the user if it's a generic file
            const fileName = file.name.toLowerCase();
            const match = fileName.match(/reserve_(\d+)/) || fileName.match(/#(\d+)/);
            
            if (match && match[1]) {
                setSearchId(match[1]);
                fetchOrder(match[1]);
                setScanning(false);
            } else {
                setScanning(false);
                setError(t('tracker.errorScan'));
            }
        }, 2500);
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
            setSearchId(orderId);
        }
    }, [orderId]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrder(searchId);
    };

    const getStatusDetails = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': 
                return {
                    icon: <CheckCircle size={48} strokeWidth={1} color="#c9a050" />,
                    color: '#c9a050',
                    label: t('tracker.validated'),
                    desc: t('tracker.validatedDesc')
                };
            case 'rejected': 
                return {
                    icon: <XCircle size={48} strokeWidth={1} color="#ff4d4d" />,
                    color: '#ff4d4d',
                    label: t('tracker.declined'),
                    desc: t('tracker.declinedDesc')
                };
            default: 
                return {
                    icon: <Clock size={48} strokeWidth={1} color="#aaa" />,
                    color: '#aaa',
                    label: t('tracker.pending'),
                    desc: t('tracker.pendingDesc')
                };
        }
    };

    const statusInfo = getStatusDetails(order?.status);

    return (
        <div className="order-tracker-page" style={{ background: '#000', minHeight: '100vh', color: '#fff', paddingTop: '160px', paddingBottom: '100px' }}>
            <style>{`
                .navbar { background: #000 !important; }
                .nav-link, .brand-name, .nav-icon-btn { color: #fff !important; }
                .navbar.scrolled { background: #000 !important; }
                .navbar.scrolled .nav-link, 
                .navbar.scrolled .brand-name, 
                .navbar.scrolled .nav-icon-btn { color: #fff !important; }
                .scan-btn:hover { background: rgba(255,255,255,0.05) !important; color: #c9a050 !important; }
                
                .search-form { display: flex; gap: 2rem; align-items: flex-end; }
                .search-input-wrapper { flex: 1; border-bottom: 2px solid #c9a050; padding-bottom: 0.5rem; }
                .search-actions { display: flex; gap: 1rem; }
                .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
                
                @media (max-width: 768px) {
                    .order-tracker-page { padding-top: 100px !important; padding-bottom: 60px !important; }
                    .container-tracker { padding: 0 1.5rem !important; }
                    .luxury-title { font-size: 2.5rem !important; margin-bottom: 0.5rem !important; }
                    .sub-header { margin-bottom: 3rem !important; }
                    .search-form { flex-direction: column; align-items: stretch; gap: 1.5rem; }
                    .search-input-wrapper { width: 100%; }
                    .search-actions { flex-direction: column; width: 100%; }
                    .search-actions button { width: 100%; padding: 1.2rem !important; }
                    .result-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                    .ticket-column { order: -1; }
                    .status-card { padding: 2.5rem !important; }
                }
            `}</style>
            
            <div className="container-tracker" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="sub-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h1 className="luxury-font luxury-title" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>{t('tracker.title')}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <div style={{ height: '1px', width: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px' }}>{t('tracker.subtitle')}</p>
                            <div style={{ height: '1px', width: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </div>
                    </div>


                    <div style={{ maxWidth: '700px', margin: '0 auto 6rem' }}>
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="search-input-wrapper">

                                <input 
                                    type="text" 
                                    placeholder={t('tracker.placeholder')}
                                    value={searchId ? (searchId.toString().startsWith('#') ? searchId : `#${searchId}`) : ''}
                                    onChange={(e) => setSearchId(e.target.value.replace('#', ''))}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '1rem 0',
                                        color: '#fff',
                                        fontSize: '1.2rem',
                                        fontFamily: 'var(--font-heading)',
                                        letterSpacing: '2px',
                                        outline: 'none',
                                        textTransform: 'uppercase'
                                    }}
                                />
                            </div>
                            
                            <div className="search-actions">

                                <button type="submit" style={{ 
                                    background: '#c9a050', 
                                    border: 'none', 
                                    padding: '1rem 2rem', 
                                    cursor: 'pointer',
                                    color: '#000',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    borderRadius: '2px'
                                }}>
                                    {t('tracker.button')}
                                </button>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileScan} 
                                    accept="application/pdf,image/*" 
                                    style={{ display: 'none' }} 
                                />
                                
                                <button 
                                    type="button" 
                                    className="scan-btn"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ 
                                        background: 'transparent', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        padding: '1rem', 
                                        cursor: 'pointer',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        borderRadius: '2px',
                                        transition: '0.3s'
                                    }}
                                >
                                    <QrCode size={20} strokeWidth={1.5} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>{t('tracker.scan')}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <AnimatePresence mode="wait">
                        {scanning ? (
                            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '8rem 0' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ display: 'inline-block', marginBottom: '2rem' }}
                                >
                                    <Loader2 size={48} color="#c9a050" strokeWidth={1} />
                                </motion.div>
                                <div style={{ fontSize: '0.8rem', letterSpacing: '5px', color: '#fff', textTransform: 'uppercase' }}>{t('tracker.scanning')}</div>
                                <p style={{ color: '#444', fontSize: '0.6rem', marginTop: '1rem', letterSpacing: '2px' }}>{t('tracker.decoding')}</p>
                            </motion.div>
                        ) : loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '6rem' }}>
                                <div className="loading-dots" style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#c9a050', textTransform: 'uppercase' }}>{t('tracker.loading')}</div>
                            </motion.div>
                        ) : error ? (
                            <motion.div key="error" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <XCircle size={32} strokeWidth={1} color="#ff4d4d" style={{ marginBottom: '1.5rem' }} />
                                <div style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>{error}</div>
                            </motion.div>
                        ) : order ? (
                            <motion.div 
                                key="result" 
                                initial={{ opacity: 0, y: 30 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="result-grid"
                            >
                                {/* Left Side: Status & Details */}
                                <div>
                                    <div className="status-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>

                                        <div style={{ marginBottom: '2rem' }}>
                                            {statusInfo.icon}
                                        </div>
                                        <h2 style={{ fontSize: '2rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1rem', color: statusInfo.color }}>{statusInfo.label}</h2>
                                        <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '3rem' }}>{statusInfo.desc}</p>
                                        
                                        <button 
                                            onClick={handleDownloadPDF}
                                            disabled={generatingPDF}
                                            style={{ 
                                                width: '100%',
                                                background: '#c9a050', 
                                                color: '#000', 
                                                border: 'none', 
                                                padding: '1.5rem', 
                                                fontWeight: '700', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '3px', 
                                                cursor: generatingPDF ? 'not-allowed' : 'pointer', 
                                                fontSize: '0.8rem', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '1rem'
                                            }}
                                        >
                                            {generatingPDF ? '...' : <><Download size={18} /> {t('tracker.exportCertificate')}</>}
                                        </button>
                                    </div>

                                    <div style={{ padding: '0 1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.6rem', color: '#c9a050', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>{t('tracker.destination')}</span>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                                    <MapPin size={16} color="#666" />
                                                    <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>{maskAddress(order.customer_address)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.6rem', color: '#c9a050', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>{t('tracker.clientContext')}</span>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                                    <Phone size={16} color="#666" />
                                                    <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>{maskPhone(order.customer_whatsapp)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: The Digital Ticket */}
                                <div className="ticket-column">
                                    <div id="acquisition-ticket" style={{

                                    background: '#0b0b0b',
                                    color: '#fff',
                                    width: '100%',
                                    maxWidth: '450px',
                                    padding: '0',
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                                    borderRadius: '2px',
                                    border: '1px solid rgba(201, 160, 80, 0.3)',
                                    overflow: 'hidden',
                                    fontFamily: 'var(--font-body)',
                                    margin: '0 auto'
                                }}>
                                    <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', bottom: '12px', border: '1px solid rgba(201, 160, 80, 0.15)', pointerEvents: 'none' }}></div>
                                    
                                    <div style={{ padding: '3.5rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', letterSpacing: '6px', textTransform: 'uppercase', margin: 0 }}>Black Energie</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem' }}>
                                            <div style={{ height: '1px', width: '25px', background: '#c9a050' }}></div>
                                            <span style={{ color: '#c9a050', fontSize: '0.6rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Artisanal Maison</span>
                                            <div style={{ height: '1px', width: '25px', background: '#c9a050' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '2.5rem' }}>
                                        <div style={{ marginBottom: '2.5rem' }}>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '4px', display: 'block', marginBottom: '0.8rem' }}>{t('product.acquisitionId')}</span>
                                            <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#c9a050', letterSpacing: '3px' }}>#{order.id}</span>
                                        </div>

                                        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>{t('tracker.reserveContent')}</span>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.8rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{order.product_name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.2rem' }}>{order.weight} x{order.quantity}</div>
                                                </div>
                                                <div style={{ color: '#c9a050', fontSize: '0.9rem' }}>${order.total_price}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>{t('tracker.client')}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{order.customer_name}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>{t('tracker.status')}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: statusInfo.color }}>{order.status}</span>
                                            </div>
                                        </div>

                                        <div style={{ 
                                            background: 'rgba(255,255,255,0.02)', 
                                            padding: '2rem 1.5rem', 
                                            borderRadius: '4px', 
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            marginBottom: '2.5rem'
                                        }}>
                                            <div style={{ background: '#fff', padding: '0.7rem', borderRadius: '2px', display: 'inline-block', marginBottom: '1rem' }}>
                                                {qrCodeBase64 ? (
                                                    <img src={qrCodeBase64} alt="Order QR" crossOrigin="anonymous" style={{ width: '110px', height: '110px', display: 'block' }} />
                                                ) : (
                                                    <div style={{ width: '110px', height: '110px', background: '#f5f5f5' }} />
                                                )}
                                            </div>
                                            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>
                                                {t('tracker.scanLogistics')}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(201, 160, 80, 0.05)', padding: '2rem', borderTop: '1px solid rgba(201, 160, 80, 0.1)' }}>
                                        <p style={{ fontSize: '0.55rem', color: 'rgba(201, 160, 80, 0.5)', letterSpacing: '5px', textTransform: 'uppercase', margin: 0 }}>
                                            {t('tracker.authenticCertificate')}
                                        </p>
                                    </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '8rem 0' }}>
                                <Package size={60} strokeWidth={0.5} color="#222" style={{ marginBottom: '2rem' }} />
                                <p style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px' }}>{t('tracker.awaiting')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderTracker;
