import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function Fab({ to = '/products' }) {
    return (
        <Link to={to} className="fab">
            <Icon name="plus" size={32} color="#000" />
        </Link>
    )
}
