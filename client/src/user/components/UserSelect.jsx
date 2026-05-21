import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const UserSelect = ({ options, value, onChange, placeholder, name }) => {
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
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            {/* Native hidden input to ensure form submission works if needed */}
            <input type="hidden" name={name} value={value || ''} required />
            
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '100%', 
                    border: 'none', 
                    borderBottom: '1px solid #eee', 
                    padding: '0.8rem 0', 
                    fontSize: '0.95rem', 
                    background: 'transparent', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: value ? '#000' : '#888'
                }}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown size={16} color="#888" style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '1px solid #eee',
                    borderTop: 'none',
                    zIndex: 1000,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                }}>
                    {options.map((option) => (
                        <div 
                            key={option.value}
                            onClick={() => {
                                onChange({ target: { name, value: option.value } });
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '0.8rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: value === option.value ? '#c9a050' : '#444',
                                background: value === option.value ? '#fcfcfc' : '#fff',
                                transition: 'all 0.2s',
                                borderBottom: '1px solid #f9f9f9'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f9f9f9';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = value === option.value ? '#fcfcfc' : '#fff';
                                e.currentTarget.style.color = value === option.value ? '#c9a050' : '#444';
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSelect;
