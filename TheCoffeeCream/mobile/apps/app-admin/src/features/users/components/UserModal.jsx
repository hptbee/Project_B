import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { userApi } from '@/shared/services/api/user'
import { Icon, useToast, LoadingSpinner, useTranslation } from '@thecoffeecream/ui-shared'
import './UserModal.scss'

export default function UserModal({ user, onClose, onSave }) {
    const { t } = useTranslation()
    const isEdit = !!user
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Staff',
        isActive: true
    })
    const [loading, setLoading] = useState(false)
    const [showRoleDropdown, setShowRoleDropdown] = useState(false)
    const { showToast } = useToast()

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email || '',
                password: '', // Don't show existing hash
                role: user.role,
                isActive: user.isActive
            })
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.username) {
            showToast('Vui lòng nhập tên đăng nhập', 'warning')
            return
        }

        if (!isEdit && !formData.password) {
            showToast('Vui lòng nhập mật khẩu cho tài khoản mới', 'warning')
            return
        }

        try {
            setLoading(true)
            if (isEdit) {
                await userApi.updateUser(user.id, formData)
                showToast(t('modal.update_success'))
            } else {
                await userApi.createUser(formData)
                showToast(t('modal.create_success'))
            }
            onSave()
        } catch (error) {
            console.error('Failed to save user:', error)
            showToast('Lỗi khi lưu thông tin nhân viên', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleRoleSelect = (value) => {
        setFormData({ ...formData, role: value })
        setShowRoleDropdown(false)
    }

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container user-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? t('modal.edit_user') : t('modal.create_user')}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>{t('auth.username')}</label>
                            <div className="input-wrapper">
                                <Icon name="user" size={18} />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Ví dụ: nhanvien01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email (Tùy chọn)</label>
                            <div className="input-wrapper">
                                <Icon name="mail" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@thecoffeecream.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{isEdit ? t('form.new_password') : t('auth.password')}</label>
                            <div className="input-wrapper">
                                <Icon name="lock" size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required={!isEdit}
                                />
                            </div>
                        </div>

                        <div className="form-row">

                            <div className="form-group flex-1">
                                <label>{t('form.role')}</label>
                                <div
                                    className={`input-wrapper no-icon custom-select-container ${showRoleDropdown ? 'active' : ''}`}
                                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                >
                                    <span className="selected-value">
                                        {formData.role === 'Admin' ? `${t('auth.role_admin')} (Admin)` : `${t('auth.role_staff')} (Staff)`}
                                    </span>
                                    <Icon name="chevronDown" size={16} className={`chevron ${showRoleDropdown ? 'rotate' : ''}`} />

                                    {showRoleDropdown && (
                                        <div className="options-dropdown">
                                            <div
                                                className={`option-item ${formData.role === 'Staff' ? 'selected' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); handleRoleSelect('Staff'); }}
                                            >
                                                {t('auth.role_staff')} (Staff)
                                            </div>
                                            <div
                                                className={`option-item ${formData.role === 'Admin' ? 'selected' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); handleRoleSelect('Admin'); }}
                                            >
                                                {t('auth.role_admin')} (Admin)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group flex-1">
                                <label>{t('common.status')}</label>
                                <div className="toggle-wrapper">
                                    <span>{t('form.enable')}</span>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>{t('action.cancel')}</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? t('common.processing') : (isEdit ? t('action.update') : t('common.create'))}
                        </button>
                    </div>
                </form>

                {loading && <LoadingSpinner fullScreen={true} />}
            </div>
        </div>,
        document.body
    )
}
