import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Image as ImageIcon, Tag, FileText, DollarSign, Box, Edit2, Trash2 } from 'lucide-react';
import { useNotification } from '../../user/context/NotificationContext';

import ConfirmModal from '../components/ConfirmModal';
import CoutureOptionsBar from '../components/CoutureOptionsBar';
import CoutureSelect from '../components/CoutureSelect';
import { MousePointer2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        product_type: 'single'
    });
    const [weights, setWeights] = useState([{ value: '', unit: 'g', price: '' }]);
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { showNotification } = useNotification();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);


    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };




    const handleEditClick = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            product_type: product.product_type || 'single'
        });
        
        try {
            const parsedWeights = typeof product.weights === 'string' 
                ? JSON.parse(product.weights) 
                : (product.weights || [{ value: '', unit: 'g', price: product.price || '' }]);
            setWeights(parsedWeights);
        } catch (e) {
            setWeights([{ value: '', unit: 'g', price: product.price || '' }]);
        }
        setImageFile(null); // Keep old image unless a new one is selected
        setPreviewImage(product.image_url);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', product_type: 'single' });
        setWeights([{ value: '', unit: 'g', price: '' }]);
        setImageFile(null);
        setPreviewImage(null);
        const fileInput = document.getElementById('product-image');
        if (fileInput) fileInput.value = '';
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/products/${productToDelete.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showNotification('Product deleted successfully!', 'success');
            fetchProducts();

            if (editingId === productToDelete.id) {
                handleCancelEdit();
            }
        } catch (err) {
            console.error(err);
            showNotification('Failed to delete product', 'error');
        } finally {
            setDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleWeightChange = (index, field, value) => {
        const newWeights = [...weights];
        newWeights[index][field] = value;
        setWeights(newWeights);
    };

    const addWeightRow = () => {
        setWeights([...weights, { value: '', unit: 'g', price: '' }]);
    };

    const removeWeightRow = (index) => {
        if (weights.length > 1) {
            const newWeights = weights.filter((_, i) => i !== index);
            setWeights(newWeights);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('product_type', formData.product_type);
            submitData.append('weights', JSON.stringify(weights));
            // Use the first weight's price as the default price for the DB column
            submitData.append('price', weights[0]?.price || 0);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            const token = localStorage.getItem('adminToken');

            if (editingId) {
                await axios.put(`/api/products/${editingId}`, submitData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                showNotification('Product updated successfully!', 'success');
                handleCancelEdit();
            } else {
                await axios.post('/api/products', submitData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                showNotification('Product added successfully!', 'success');
                setFormData({ name: '', description: '', product_type: 'single' });
                setWeights([{ value: '', unit: 'g', price: '' }]);
                setImageFile(null);
                const fileInput = document.getElementById('product-image');
                if (fileInput) fileInput.value = '';
            }

            setPreviewImage(null);
            fetchProducts(); // Refresh list

        } catch (err) {
            console.error('Submit Error:', err.response?.data);
            showNotification(err.response?.data?.error || `Failed to ${editingId ? 'update' : 'add'} product`, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="products-page">
            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Yes, Delete"
                cancelText="No, Keep It"
            />

            <div className="title-section">
                <h2 className="page-title">Product Management</h2>
                <p>Curate & manage your luxury coffee catalog.</p>
            </div>

            <div className="layout-grid">
                {/* Add Product Form */}
                <div className="form-container">
                    <h3 className="section-subtitle">
                        {editingId ? 'Edit Blend' : 'Add New Blend'}
                        {editingId ? <Edit2 size={24} style={{ color: 'var(--admin-primary)' }} /> : <PlusCircle size={24} style={{ color: 'var(--admin-primary)' }} />}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="chic-input-group">
                            <input
                                type="text"
                                className="chic-input"
                                name="name"
                                placeholder="Product Name (e.g. Ethiopian Yirgacheffe)"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <CoutureSelect 
                            label="Catalog Placement"
                            placeholder="Select Placement"
                            options={[
                                { label: 'Single Origin / Shop', value: 'single', icon: <MousePointer2 size={18} /> },
                                { label: 'Packs / Collections', value: 'pack', icon: <Package size={18} /> }
                            ]}
                            value={formData.product_type}
                            onChange={(val) => setFormData({...formData, product_type: val})}
                        />

                        <div className="weights-section" style={{ marginBottom: '2rem' }}>
                            <label className="section-subtitle" style={{ display: 'block', marginBottom: '1rem', fontSize: '0.65rem' }}>Pricing & Weights</label>
                            {weights.map((w, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 40px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <input 
                                        type="number" 
                                        className="chic-input"
                                        placeholder="Value"
                                        value={w.value}
                                        onChange={(e) => handleWeightChange(index, 'value', e.target.value)}
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                    <select 
                                        className="chic-input"
                                        value={w.unit}
                                        onChange={(e) => handleWeightChange(index, 'unit', e.target.value)}
                                        style={{ marginBottom: 0, padding: '0.5rem', height: '100%' }}
                                    >
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                    </select>
                                    <input 
                                        type="number" 
                                        className="chic-input"
                                        placeholder="Price"
                                        value={w.price}
                                        onChange={(e) => handleWeightChange(index, 'price', e.target.value)}
                                        required
                                        style={{ marginBottom: 0 }}
                                    />
                                    {weights.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeWeightRow(index)}
                                            style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={addWeightRow}
                                style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
                            >
                                <PlusCircle size={14} /> Add Another Weight
                            </button>
                        </div>

                        <div className="chic-input-group">
                            <textarea
                                className="chic-input"
                                name="description"
                                placeholder="Detailed description of tasting notes, origin, and roast profile..."
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <label
                            className="file-upload-wrapper"
                            style={{
                                backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: previewImage ? '1px solid var(--admin-primary)' : '1px dashed var(--admin-text-muted)'
                            }}
                        >
                            <input
                                id="product-image"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                required={!editingId}
                            />
                            <div className="file-upload-text" style={{
                                background: previewImage ? 'rgba(0,0,0,0.6)' : 'transparent',
                                padding: previewImage ? '1.5rem' : '0',
                                borderRadius: '12px',
                                color: previewImage ? '#fff' : 'var(--admin-text-main)',
                                zIndex: 2,
                                transition: 'all 0.3s'
                            }}>
                                <ImageIcon size={28} style={{ margin: '0 auto 0.75rem', display: 'block', color: previewImage ? '#fff' : 'var(--admin-text-main)' }} />
                                {imageFile ? imageFile.name : (editingId ? 'Change Product Image' : 'Upload Packaging Image')}
                            </div>
                        </label>




                        <button
                            type="submit"
                            className="btn-couture"
                            disabled={submitLoading}
                        >
                            {submitLoading ? 'Saving...' : (editingId ? 'Update Catalog' : 'Save to Catalog')}
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

                {/* Product List */}
                <div className="gallery-container">
                    <h3 className="section-subtitle">
                        Current Offerings
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--admin-text-muted)' }}>
                            {products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'}
                        </span>
                    </h3>

                    {loading ? (
                        <div className="empty-gallery">
                            <div className="empty-gallery-content">
                                <p>Loading catalog...</p>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-gallery">
                            <div className="empty-gallery-content">
                                <Box size={40} style={{ color: 'var(--admin-primary)', marginBottom: '1.5rem' }} />
                                <p>No products found.</p>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--admin-text-muted)', marginTop: '1rem', display: 'block' }}>
                                    Add your first product!
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {products.map(product => (
                                <div key={product.id} className="couture-product-card" style={{ display: 'flex', alignItems: 'center' }}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="couture-product-img" />
                                    ) : (
                                        <div className="couture-product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--admin-border)' }}>
                                            <ImageIcon size={24} style={{ color: 'var(--admin-text-muted)' }} />
                                        </div>
                                    )}
                                    <div className="couture-product-info" style={{ flex: 1, paddingRight: '1rem' }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>
                                            <span 
                                                onClick={() => navigate(`/admin/dashboard/product/${encodeURIComponent(product.name)}`)}
                                                style={{ cursor: 'pointer', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '2px', transition: 'border-color 0.3s' }}
                                                onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--admin-primary)'}
                                                onMouseLeave={(e) => e.target.style.borderBottomColor = 'rgba(212,175,55,0.3)'}
                                            >
                                                {product.name}
                                            </span>
                                        </h3>
                                        <div className="price-type-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div className="price" style={{ margin: 0 }}>${product.price}</div>
                                            <span style={{ fontSize: '0.6rem', padding: '2px 8px', border: '1px solid var(--admin-border)', textTransform: 'uppercase', letterSpacing: '1px', color: product.product_type === 'pack' ? 'var(--admin-primary)' : 'inherit' }}>
                                                {product.product_type === 'pack' ? 'PACK' : 'SINGLE'}
                                            </span>
                                        </div>
                                        <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {product.description}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            style={{ background: 'var(--admin-glass)', border: '1px solid var(--admin-border)', padding: '0.75rem', borderRadius: '0', color: 'var(--admin-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                            title="Edit Product"
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--admin-primary)'; e.currentTarget.style.color = 'var(--admin-primary)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.color = 'var(--admin-text-main)'; }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            style={{ background: 'var(--admin-glass)', border: '1px solid var(--admin-border)', padding: '0.75rem', borderRadius: '0', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                                            title="Delete Product"
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

export default Products;
