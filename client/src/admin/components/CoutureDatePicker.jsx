import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const CoutureDatePicker = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'
    
    // Parse current value or default to today's date
    const initialDate = value ? new Date(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const dropdownRef = useRef(null);

    // Keep currentMonth/currentYear synced with incoming value changes
    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setCurrentMonth(d.getMonth());
            setCurrentYear(d.getFullYear());
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset view mode when dropdown is closed
    useEffect(() => {
        if (!isOpen) {
            setViewMode('days');
        }
    }, [isOpen]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrev = (e) => {
        e.stopPropagation();
        if (viewMode === 'days') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else if (viewMode === 'months') {
            setCurrentYear(currentYear - 1);
        } else if (viewMode === 'years') {
            setCurrentYear(currentYear - 16);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (viewMode === 'days') {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        } else if (viewMode === 'months') {
            setCurrentYear(currentYear + 1);
        } else if (viewMode === 'years') {
            setCurrentYear(currentYear + 16);
        }
    };

    const handleSelectDay = (day) => {
        // Format as YYYY-MM-DD in local time
        const pad = (num) => String(num).padStart(2, '0');
        const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const toggleMonthView = (e) => {
        e.stopPropagation();
        setViewMode(viewMode === 'months' ? 'days' : 'months');
    };

    const toggleYearView = (e) => {
        e.stopPropagation();
        setViewMode(viewMode === 'years' ? 'days' : 'years');
    };

    // Calculate days
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const daysArray = [];
    // Empty slots before first day
    for (let i = 0; i < firstDayIndex; i++) {
        daysArray.push(null);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return 'Select Date';
        const d = new Date(dateStr);
        // Display as elegant Month DD, YYYY
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="couture-select-wrapper" ref={dropdownRef} style={{ marginBottom: '2rem', position: 'relative', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>
                    {label}
                </label>
            )}

            {/* Selector Header */}
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
                    <Calendar size={18} style={{ color: 'var(--admin-primary)', display: 'flex' }} />
                    <span style={{ fontSize: '0.9rem', color: value ? 'var(--admin-text-main)' : 'var(--admin-text-muted)' }}>
                        {formatDateDisplay(value)}
                    </span>
                </div>
                <ChevronDown size={18} style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--admin-text-muted)' }} />
            </div>

            {/* Custom Styled Calendar Dropdown */}
            {isOpen && (
                <div className="couture-dropdown-list" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    minWidth: '280px', // Perfect width for calendar dropdown
                    background: 'var(--admin-bg-dark)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '12px',
                    zIndex: 1000,
                    padding: '1.2rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    animation: 'selectFadeIn 0.2s ease-out',
                }}>
                    {/* Calendar Month/Year Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <button 
                            type="button"
                            onClick={handlePrev}
                            style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <span 
                                onClick={toggleMonthView} 
                                style={{ 
                                    cursor: 'pointer', 
                                    color: viewMode === 'months' ? 'var(--admin-primary)' : 'var(--admin-text-main)',
                                    transition: 'color 0.2s ease',
                                    borderBottom: viewMode === 'months' ? '2px solid var(--admin-primary)' : '2px solid transparent',
                                    paddingBottom: '2px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
                                onMouseLeave={(e) => {
                                    if (viewMode !== 'months') {
                                        e.currentTarget.style.color = 'var(--admin-text-main)';
                                    }
                                }}
                            >
                                {months[currentMonth]}
                            </span>
                            <span 
                                onClick={toggleYearView} 
                                style={{ 
                                    cursor: 'pointer', 
                                    color: viewMode === 'years' ? 'var(--admin-primary)' : 'var(--admin-text-main)',
                                    transition: 'color 0.2s ease',
                                    borderBottom: viewMode === 'years' ? '2px solid var(--admin-primary)' : '2px solid transparent',
                                    paddingBottom: '2px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
                                onMouseLeave={(e) => {
                                    if (viewMode !== 'years') {
                                        e.currentTarget.style.color = 'var(--admin-text-main)';
                                    }
                                }}
                            >
                                {currentYear}
                            </span>
                        </div>
                        <button 
                            type="button"
                            onClick={handleNext}
                            style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Weekdays (Only in days mode) */}
                    {viewMode === 'days' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <span key={day} style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {day}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Days Grid (Only in days mode) */}
                    {viewMode === 'days' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                            {daysArray.map((day, idx) => {
                                if (day === null) {
                                    return <div key={`empty-${idx}`} />;
                                }
                                
                                const pad = (num) => String(num).padStart(2, '0');
                                const dayStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
                                const isSelected = value === dayStr;
                                
                                const today = new Date();
                                const isToday = today.getDate() === day && 
                                                today.getMonth() === currentMonth && 
                                                today.getFullYear() === currentYear;
                                
                                return (
                                    <div 
                                        key={day}
                                        onClick={() => handleSelectDay(day)}
                                        style={{
                                            aspectRatio: '1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: isSelected ? 'var(--admin-primary)' : 'transparent',
                                            color: isSelected ? '#000' : 'var(--admin-text-main)',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            border: isToday ? '1px solid var(--admin-primary)' : '1px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.color = 'var(--admin-primary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--admin-text-main)';
                                            }
                                        }}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Months Selector Grid */}
                    {viewMode === 'months' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                            {months.map((m, idx) => {
                                const isCurrent = idx === currentMonth;
                                return (
                                    <div
                                        key={m}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentMonth(idx);
                                            setViewMode('days');
                                        }}
                                        style={{
                                            padding: '10px 0',
                                            fontSize: '0.8rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: isCurrent ? 'var(--admin-primary)' : 'transparent',
                                            color: isCurrent ? '#000' : 'var(--admin-text-main)',
                                            fontWeight: isCurrent ? 'bold' : 'normal',
                                            textAlign: 'center',
                                            border: '1px solid ' + (isCurrent ? 'var(--admin-primary)' : 'transparent')
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.color = 'var(--admin-primary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--admin-text-main)';
                                            }
                                        }}
                                    >
                                        {m.substring(0, 3)}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Years Selector Grid */}
                    {viewMode === 'years' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' }}>
                            {Array.from({ length: 16 }, (_, i) => {
                                const y = currentYear - 7 + i;
                                const isCurrent = y === currentYear;
                                return (
                                    <div
                                        key={y}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentYear(y);
                                            setViewMode('days');
                                        }}
                                        style={{
                                            padding: '10px 0',
                                            fontSize: '0.8rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: isCurrent ? 'var(--admin-primary)' : 'transparent',
                                            color: isCurrent ? '#000' : 'var(--admin-text-main)',
                                            fontWeight: isCurrent ? 'bold' : 'normal',
                                            textAlign: 'center',
                                            border: '1px solid ' + (isCurrent ? 'var(--admin-primary)' : 'transparent')
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.color = 'var(--admin-primary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--admin-text-main)';
                                            }
                                        }}
                                    >
                                        {y}
                                    </div>
                                );
                            })}
                        </div>
                    )}
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

export default CoutureDatePicker;
