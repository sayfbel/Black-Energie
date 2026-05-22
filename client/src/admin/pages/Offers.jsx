import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Ticket, PlusCircle, Trash2, Calendar, Percent, DollarSign, Package, Coffee } from 'lucide-react';
import { useNotification } from '../../user/context/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';
import CoutureOptionsBar from '../components/CoutureOptionsBar';
import CoutureSelect from '../components/CoutureSelect';
import CoutureDatePicker from '../components/CoutureDatePicker';
import { LayoutDashboard, Globe, MousePointer2 } from 'lucide-react';

const Offers = () => {
    const [activeTab, setActiveTab] = useState('offers');
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { showNotification } = useNotification();

    // Offer Form State
    const [offerForm, setOfferForm] = useState({
        name: '',
        type: 'single',
        discount_type: 'percentage',
        discount_value: '',
        target_ids: [],
        start_date: '',
        end_date: ''
    });

    // Coupon Form State
    const [couponForm, setCouponForm] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '0',
        start_date: '',
        end_date: ''
    });

    const [deleteModal, setDeleteModal] = useState({ open: false, type: null, item: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                window.location.href = '/admin/login';
                return;
            }
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [productsRes, offersRes, couponsRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/marketing/offers', config),
                axios.get('/api/marketing/coupons', config)
            ]);
            setProducts(productsRes.data);
            setOffers(offersRes.data);
            setCoupons(couponsRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
            } else {
                showNotification('Failed to load data', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/marketing/offers', offerForm, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showNotification('Offer created successfully!', 'success');
            setOfferForm({
                name: '',
                type: 'single',
                discount_type: 'percentage',
                discount_value: '',
                target_ids: [],
                start_date: '',
                end_date: ''
            });
            fetchData();
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to create offer', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/marketing/coupons', couponForm, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showNotification('Coupon created successfully!', 'success');
            setCouponForm({
                code: '',
                discount_type: 'percentage',
                discount_value: '',
                min_order_amount: '0',
                start_date: '',
                end_date: ''
            });
            fetchData();
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to create coupon', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteClick = (type, item) => {
        setDeleteModal({ open: true, type, item });
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = deleteModal.type === 'offer' 
                ? `/api/marketing/offers/${deleteModal.item.id}` 
                : `/api/marketing/coupons/${deleteModal.item.id}`;
            
            await axios.delete(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showNotification(`${deleteModal.type === 'offer' ? 'Offer' : 'Coupon'} deleted`, 'success');
            fetchData();
        } catch (err) {
            showNotification('Failed to delete', 'error');
        } finally {
            setDeleteModal({ open: false, type: null, item: null });
        }
    };

    const toggleTargetId = (id) => {
        const current = [...offerForm.target_ids];
        if (current.includes(id)) {
            setOfferForm({ ...offerForm, target_ids: current.filter(item => item !== id) });
        } else {
            setOfferForm({ ...offerForm, target_ids: [...current, id] });
        }
    };

    return (
        <div className="offers-page">
            <ConfirmModal
                isOpen={deleteModal.open}
                title={`Delete ${deleteModal.type === 'offer' ? 'Offer' : 'Coupon'}`}
                message={`Are you sure you want to delete "${deleteModal.item?.name || deleteModal.item?.code}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ open: false, type: null, item: null })}
                confirmText="Yes, Delete"
                cancelText="No"
            />

            <div className="title-section">
                <h2 className="page-title">Marketing & Promotions</h2>
                <p>Manage offers, sales, and exclusive coupon codes.</p>
            </div>

            <div className="admin-tabs" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)' }}>
                <button 
                    className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offers')}
                    style={{ padding: '1rem', background: 'none', border: 'none', color: activeTab === 'offers' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', cursor: 'pointer', borderBottom: activeTab === 'offers' ? '2px solid var(--admin-primary)' : 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}
                >
                    <Tag size={18} style={{ marginRight: '8px' }} /> Offers
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('coupons')}
                    style={{ padding: '1rem', background: 'none', border: 'none', color: activeTab === 'coupons' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', cursor: 'pointer', borderBottom: activeTab === 'coupons' ? '2px solid var(--admin-primary)' : 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}
                >
                    <Ticket size={18} style={{ marginRight: '8px' }} /> Coupons
                </button>
            </div>

            <div className="layout-grid">
                {activeTab === 'offers' ? (
                    <>
                        <div className="form-container">
                            <h3 className="section-subtitle">Create New Offer <PlusCircle size={20} /></h3>
                            <form onSubmit={handleOfferSubmit}>
                                <div className="chic-input-group">
                                    <input 
                                        type="text" 
                                        className="chic-input" 
                                        placeholder="Offer Name (e.g. Summer Sale)"
                                        value={offerForm.name}
                                        onChange={(e) => setOfferForm({...offerForm, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <CoutureSelect 
                                    label="Offer Type"
                                    placeholder="Select Type"
                                    options={[
                                        { label: 'All Products', value: 'all', icon: <Globe size={18} /> },
                                        { label: 'Single Product', value: 'single', icon: <MousePointer2 size={18} /> },
                                        { label: 'Group of Products', value: 'group', icon: <Package size={18} /> }
                                    ]}
                                    value={offerForm.type}
                                    onChange={(val) => setOfferForm({...offerForm, type: val, target_ids: []})}
                                />

                                {offerForm.type !== 'all' && (
                                    <div className="product-visual-grid" style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                                        gap: '1rem', 
                                        marginBottom: '1.5rem', 
                                        padding: '1rem', 
                                        background: 'rgba(255,255,255,0.02)', 
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: '4px'
                                    }}>
                                        {products.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => {
                                                    if (offerForm.type === 'single') {
                                                        setOfferForm({...offerForm, target_ids: [p.id]});
                                                    } else {
                                                        toggleTargetId(p.id);
                                                    }
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    border: offerForm.target_ids.includes(p.id) ? '2px solid var(--admin-primary)' : '1px solid rgba(255,255,255,0.1)',
                                                    transition: 'all 0.3s ease',
                                                    background: offerForm.target_ids.includes(p.id) ? 'rgba(201, 160, 80, 0.1)' : 'transparent',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ height: '80px', overflow: 'hidden' }}>
                                                    <img 
                                                        src={p.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=200'} 
                                                        alt={p.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: offerForm.target_ids.includes(p.id) ? 1 : 0.6 }} 
                                                    />
                                                </div>
                                                <div style={{ fontSize: '0.65rem', padding: '0.4rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: offerForm.target_ids.includes(p.id) ? 'var(--admin-primary)' : '#888' }}>
                                                    {p.name}
                                                </div>
                                                {offerForm.target_ids.includes(p.id) && (
                                                    <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'var(--admin-primary)', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <CoutureSelect 
                                        label="Discount Type"
                                        placeholder="Select Discount"
                                        options={[
                                            { label: 'Percentage', value: 'percentage', icon: <Percent size={18} /> },
                                            { label: 'Fixed Price', value: 'fixed', icon: <DollarSign size={18} /> }
                                        ]}
                                        value={offerForm.discount_type}
                                        onChange={(val) => setOfferForm({...offerForm, discount_type: val})}
                                    />
                                    <div className="chic-input-group">
                                        <input 
                                            type="number" 
                                            className="chic-input" 
                                            placeholder="Value"
                                            value={offerForm.discount_value}
                                            onChange={(e) => setOfferForm({...offerForm, discount_value: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <CoutureDatePicker 
                                        label="Start Date"
                                        value={offerForm.start_date}
                                        onChange={(val) => setOfferForm({...offerForm, start_date: val})}
                                    />
                                    <CoutureDatePicker 
                                        label="End Date"
                                        value={offerForm.end_date}
                                        onChange={(val) => setOfferForm({...offerForm, end_date: val})}
                                    />
                                </div>

                                <button type="submit" className="btn-couture" disabled={submitLoading}>
                                    {submitLoading ? 'Creating...' : 'Create Offer'}
                                </button>
                            </form>
                        </div>

                        <div className="gallery-container">
                            <h3 className="section-subtitle">Active & Scheduled Offers</h3>
                            {offers.length === 0 ? (
                                <div className="empty-gallery">
                                    <p>No active offers found.</p>
                                </div>
                            ) : (
                                <div className="offers-list">
                                    {offers.map(offer => (
                                        <div key={offer.id} className="couture-product-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-primary)' }}>{offer.name}</h4>
                                                <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>
                                                    <strong>{offer.discount_value}{offer.discount_type === 'percentage' ? '%' : '$'} OFF</strong> • 
                                                    {offer.type === 'all' ? ' All Products' : ` ${offer.target_ids.length} Product(s)`}
                                                </p>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span><Calendar size={12} /> {offer.start_date ? new Date(offer.start_date).toLocaleDateString() : 'Now'} - {offer.end_date ? new Date(offer.end_date).toLocaleDateString() : 'Forever'}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteClick('offer', offer)}
                                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-container">
                            <h3 className="section-subtitle">Create Coupon <PlusCircle size={20} /></h3>
                            <form onSubmit={handleCouponSubmit}>
                                <div className="chic-input-group">
                                    <input 
                                        type="text" 
                                        className="chic-input" 
                                        placeholder="Coupon Code (e.g. WELCOME20)"
                                        value={couponForm.code}
                                        onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <CoutureSelect 
                                        label="Discount Type"
                                        placeholder="Select Discount"
                                        options={[
                                            { label: 'Percentage', value: 'percentage', icon: <Percent size={18} /> },
                                            { label: 'Fixed Price', value: 'fixed', icon: <DollarSign size={18} /> }
                                        ]}
                                        value={couponForm.discount_type}
                                        onChange={(val) => setCouponForm({...couponForm, discount_type: val})}
                                    />
                                    <div className="chic-input-group">
                                        <input 
                                            type="number" 
                                            className="chic-input" 
                                            placeholder="Value"
                                            value={couponForm.discount_value}
                                            onChange={(e) => setCouponForm({...couponForm, discount_value: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="chic-input-group">
                                    <label style={{ fontSize: '0.6rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.3rem' }}>Minimum Order Amount ($)</label>
                                    <input 
                                        type="number" 
                                        className="chic-input" 
                                        value={couponForm.min_order_amount}
                                        onChange={(e) => setCouponForm({...couponForm, min_order_amount: e.target.value})}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <CoutureDatePicker 
                                        label="Start Date"
                                        value={couponForm.start_date}
                                        onChange={(val) => setCouponForm({...couponForm, start_date: val})}
                                    />
                                    <CoutureDatePicker 
                                        label="End Date"
                                        value={couponForm.end_date}
                                        onChange={(val) => setCouponForm({...couponForm, end_date: val})}
                                    />
                                </div>

                                <button type="submit" className="btn-couture" disabled={submitLoading}>
                                    {submitLoading ? 'Creating...' : 'Generate Coupon'}
                                </button>
                            </form>
                        </div>

                        <div className="gallery-container">
                            <h3 className="section-subtitle">Active Coupons</h3>
                            {coupons.length === 0 ? (
                                <div className="empty-gallery">
                                    <p>No coupons found.</p>
                                </div>
                            ) : (
                                <div className="coupons-list">
                                    {coupons.map(coupon => (
                                        <div key={coupon.id} className="couture-product-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>{coupon.code}</h4>
                                                <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>
                                                    <strong>{coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : '$'} OFF</strong> • 
                                                    Min Order: ${coupon.min_order_amount}
                                                </p>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                                                    {coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : 'Now'} - {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'Forever'}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteClick('coupon', coupon)}
                                                style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Offers;
