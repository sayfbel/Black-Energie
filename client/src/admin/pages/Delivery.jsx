import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit2, Trash2, Truck } from 'lucide-react';
import { useNotification } from '../../user/context/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';
import CoutureSelect from '../components/CoutureSelect';

const CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
    "Safi", "Mohammedia", "Khouribga", "Beni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Ksar El Kebir",
    "Larache", "Khemisset", "Guelmim", "Berrechid", "Taourirt", "Ouarzazate", "Essaouira", "Ifrane", "Taroudant",
    "Dakhla", "Laayoune", "Chefchaouen", "Al Hoceima", "Errachidia"
].sort();

const Delivery = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({ city: '', cost: '' });
    const [editingId, setEditingId] = useState(null);
    const { showNotification } = useNotification();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/admin/delivery', { headers: { 'Authorization': `Bearer ${token}` } });
            setDeliveries(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            if (editingId) {
                await axios.put(`/api/admin/delivery/${editingId}`, formData, { headers: { 'Authorization': `Bearer ${token}` } });
                showNotification('Delivery cost updated successfully', 'success');
            } else {
                await axios.post('/api/admin/delivery', formData, { headers: { 'Authorization': `Bearer ${token}` } });
                showNotification('Delivery cost added successfully', 'success');
            }
            setFormData({ city: '', cost: '' });
            setEditingId(null);
            fetchDeliveries();
        } catch (err) {
            console.error(err);
            showNotification(err.response?.data?.error || 'Operation failed', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setFormData({ city: item.city, cost: item.cost });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ city: '', cost: '' });
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/admin/delivery/${itemToDelete.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            showNotification('Delivery rule deleted', 'success');
            fetchDeliveries();
        } catch (err) {
            console.error(err);
            showNotification('Failed to delete', 'error');
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="products-page">
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Delivery Rule"
                message={`Are you sure you want to remove the delivery rule for "${itemToDelete?.city}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                confirmText="Yes, Delete"
                cancelText="Cancel"
            />

            <div className="title-section">
                <h2 className="page-title">Delivery Management</h2>
                <p>Configure shipping zones and logistics pricing.</p>
            </div>

            <div className="layout-grid">
                <div className="form-container">
                    <h3 className="section-subtitle">
                        {editingId ? 'Edit Logistics Zone' : 'Add New Zone'}
                        {editingId ? <Edit2 size={24} style={{ color: 'var(--admin-primary)' }} /> : <PlusCircle size={24} style={{ color: 'var(--admin-primary)' }} />}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="chic-input-group">
                            <CoutureSelect
                                options={CITIES.map(c => ({ value: c, label: c }))}
                                value={formData.city}
                                onChange={(val) => setFormData({ ...formData, city: val })}
                                placeholder="Select a City..."
                            />
                        </div>
                        <div className="chic-input-group">
                            <input
                                type="number"
                                className="chic-input"
                                name="cost"
                                placeholder="Delivery Cost ($)"
                                value={formData.cost}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-couture" disabled={submitLoading}>
                            {submitLoading ? 'Saving...' : (editingId ? 'Update Zone' : 'Add Zone')}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-couture"
                                style={{ marginTop: '1rem', backgroundColor: 'transparent', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-text-muted)' }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <div className="gallery-container">
                    <h3 className="section-subtitle">
                        Active Logistics Zones
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--admin-text-muted)' }}>
                            {deliveries.length} {deliveries.length === 1 ? 'ZONE' : 'ZONES'}
                        </span>
                    </h3>

                    {loading ? (
                        <div className="empty-gallery">
                            <div className="empty-gallery-content">
                                <p>Loading logistics data...</p>
                            </div>
                        </div>
                    ) : deliveries.length === 0 ? (
                        <div className="empty-gallery">
                            <div className="empty-gallery-content">
                                <Truck size={40} style={{ color: 'var(--admin-primary)', marginBottom: '1.5rem' }} />
                                <p>No delivery zones configured.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {deliveries.map(item => (
                                <div key={item.id} className="couture-product-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--admin-text-main)', fontSize: '1.2rem' }}>{item.city}</h3>
                                        <div style={{ color: 'var(--admin-primary)', fontWeight: '600', fontSize: '1.5rem' }}>
                                            ${item.cost}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            style={{ background: 'var(--admin-glass)', border: '1px solid var(--admin-border)', padding: '0.75rem', borderRadius: '0', color: 'var(--admin-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--admin-primary)'; e.currentTarget.style.color = 'var(--admin-primary)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.color = 'var(--admin-text-main)'; }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item)}
                                            style={{ background: 'var(--admin-glass)', border: '1px solid var(--admin-border)', padding: '0.75rem', borderRadius: '0', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--admin-danger)'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--admin-glass)'; e.currentTarget.style.color = 'var(--admin-danger)'; }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Delivery;
