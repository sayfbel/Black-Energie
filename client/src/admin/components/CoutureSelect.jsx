import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CoutureSelect = ({ options, value, onChange, placeholder, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="couture-select-wrapper" ref={dropdownRef} style={{ marginBottom: '2rem', position: 'relative' }}>
            {label && (
                <label style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>
                    {label}
                </label>
            )}
            
            {/* Dropdown Header */}
            <div 
                className={`couture-select-header ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'var(--admin-bg-dark)',
                    border: '1px solid var(--admin-border)',
                    padding: '0.8rem 1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    boxShadow: isOpen ? '0 0 0 2px rgba(201, 160, 80, 0.2)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {selectedOption?.icon && <span style={{ color: 'var(--admin-primary)', display: 'flex' }}>{selectedOption.icon}</span>}
                    <span style={{ fontSize: '0.9rem', color: selectedOption ? 'var(--admin-text-main)' : 'var(--admin-text-muted)' }}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown size={18} style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--admin-text-muted)' }} />
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="couture-dropdown-list" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'var(--admin-bg-dark)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '12px',
                    zIndex: 1000,
                    padding: '8px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    animation: 'selectFadeIn 0.2s ease-out',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {options.map((option) => {
                        const isSelected = value === option.value;
                        return (
                            <div 
                                key={option.value}
                                className="couture-option-item"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    marginBottom: '2px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {option.icon && (
                                    <span style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-muted)'
                                    }}>
                                        {option.icon}
                                    </span>
                                )}
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    color: isSelected ? 'var(--admin-text-main)' : 'var(--admin-text-muted)',
                                    fontWeight: isSelected ? '500' : '400'
                                }}>
                                    {option.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <style>{`
                @keyframes selectFadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CoutureSelect;
