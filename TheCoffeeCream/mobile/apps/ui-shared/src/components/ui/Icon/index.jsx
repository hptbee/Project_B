import React from 'react'
import { FiSearch, FiMenu, FiRefreshCw, FiBell, FiLogOut, FiPieChart, FiTrash2, FiClock, FiBarChart2, FiCheckCircle, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const map = {
    search: FiSearch,
    menu: FiMenu,
    sync: FiRefreshCw,
    bell: FiBell,
    logout: FiLogOut,
    report: FiPieChart,
    trash: FiTrash2,
    history: FiClock,
    chart: FiBarChart2,
    check: FiCheckCircle,
    chevronLeft: FiChevronLeft,
    chevronRight: FiChevronRight,
    chevronDown: FiChevronDown,
    chevronUp: FiChevronUp,
    plus: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    minus: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}

export function Icon({ name, size = 20, className = '', color = 'currentColor' }) {
    const Comp = map[name]
    if (!Comp) return <span style={{ width: size, height: size }} className={`icon-placeholder ${className}`} />
    return <Comp size={size} className={className} color={color} />
}
