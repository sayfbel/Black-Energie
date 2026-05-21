import React from 'react';

const CoutureOptionsBar = ({ options, value, onChange, label }) => {
    return (
        <div className="couture-options-wrapper" style={{ marginBottom: '2.5rem' }}>
            {label && (
                <label style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'block' }}>
                    {label}
                </label>
            )}
            <div className="options-bar-container" style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--admin-border)',
                padding: '4px',
                borderRadius: '4px',
                width: '100%'
            }}>
                {options.map((option) => {
                    const isActive = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            style={{
                                flex: 1,
                                padding: '0.8rem 0.5rem',
                                background: isActive ? 'var(--admin-primary)' : 'transparent',
                                color: isActive ? '#000' : 'var(--admin-text-muted)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: isActive ? '600' : '400',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                borderRadius: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CoutureOptionsBar;
