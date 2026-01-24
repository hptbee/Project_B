import React from 'react'
import { FiSearch, FiMenu, FiRefreshCw, FiBell, FiLogOut, FiPieChart, FiTrash2, FiClock, FiBarChart2 } from 'react-icons/fi'
import '@/styles/components.scss'

const map = {
    search: FiSearch,
    menu: FiMenu,
    sync: FiRefreshCw,
    bell: FiBell,
    logout: FiLogOut,
    report: FiPieChart,
    trash: FiTrash2,
    history: FiClock,
    chart: FiBarChart2
}

export default function Icon({ name, size = 20, className = '', color = '#111' }) {
    const Comp = map[name]
    if (!Comp) return <span style={{ width: size, height: size }} className={`icon-placeholder ${className}`} />
    return <Comp size={size} className={className} color={color} />
}
