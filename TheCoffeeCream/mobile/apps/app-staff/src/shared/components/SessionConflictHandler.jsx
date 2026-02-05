import { useEffect, useState } from 'react'
import { ConfirmModal, useToast } from '@thecoffeecream/ui-shared'
import { useNavigate } from 'react-router-dom'

export default function SessionConflictHandler() {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        const handleConflict = (event) => {
            setShow(true)
        }

        window.addEventListener('auth:session_conflict', handleConflict)

        return () => {
            window.removeEventListener('auth:session_conflict', handleConflict)
        }
    }, [])

    const handleConfirm = () => {
        setShow(false)
        // Clear token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_info')
        // Redirect to login
        navigate('/login')
    }

    if (!show) return null

    return (
        <ConfirmModal
            show={true}
            title="Đăng xuất bắt buộc"
            message="Tài khoản của bạn đã được đăng nhập trên một thiết bị khác. Phiên làm việc hiện tại đã hết hạn."
            confirmText="Đăng nhập lại"
            onConfirm={handleConfirm}
            // Hide cancel button specifically for this modal type if supported, or just handle verify
            // For now assuming ConfirmModal prevents closing without action if we don't provide onCancel? 
            // Or we just force redirect on any action.
            onCancel={handleConfirm}
            cancelText=""
            type="danger"
        />
    )
}
