import React from 'react'

export default function Button({ children, onClick }) {
    return (
        <button onClick={onClick} style={{ padding: '10px 16px', borderRadius: 8, background: '#6b3e2f', color: '#fff', border: 'none' }}>
            {children}
        </button>
    )
}
