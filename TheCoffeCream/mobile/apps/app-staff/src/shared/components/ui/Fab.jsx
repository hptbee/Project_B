import React from 'react'
import { Link } from 'react-router-dom'

export default function Fab({ to = '/products' }) {
    return (
        <Link to={to} className="fab">＋</Link>
    )
}
