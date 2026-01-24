import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    const nav = useNavigate()
    useEffect(() => { // mock logout then redirect
        setTimeout(() => nav('/'), 600)
    }, [])
    return <div className="page"><div className="page-content">Đang đăng xuất...</div></div>
}
