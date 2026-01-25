import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner, Badge, ConfirmModal, Icon, useToast, SearchBar, Pagination, useTranslation, usersApi as userApi } from '@thecoffeecream/ui-shared'
import UserModal from '../components/UserModal'
import './UserList.scss'

export default function UserList() {
    const { t } = useTranslation()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [confirmToggle, setConfirmToggle] = useState({ show: false, user: null })
    const [searchQuery, setSearchQuery] = useState('')
    const { showToast } = useToast()

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' })

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await userApi.getAllUsers()
            setUsers(data)
        } catch (error) {
            console.error('Failed to load users:', error)
            if (error.message.includes('403') || error.status === 403) {
                showToast(t('modal.permission_denied'), 'error')
            } else {
                showToast(t('modal.load_error'), 'error')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleCreate = () => {
        setSelectedUser(null)
        setShowModal(true)
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleToggleStatus = (user) => {
        setConfirmToggle({
            show: true,
            user
        })
    }

    const filteredAndSortedUsers = useMemo(() => {
        let result = users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Sort
        result.sort((a, b) => {
            const valA = a[sortConfig.key] || ''
            const valB = b[sortConfig.key] || ''

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [users, searchQuery, sortConfig])

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredAndSortedUsers.slice(start, start + itemsPerPage)
    }, [filteredAndSortedUsers, currentPage, itemsPerPage])

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <Icon name="chevron-down" size={12} style={{ opacity: 0.2 }} />
        return sortConfig.direction === 'asc'
            ? <Icon name="chevron-up" size={12} color="var(--accent-amber)" />
            : <Icon name="chevron-down" size={12} color="var(--accent-amber)" />
    }

    const executeToggleStatus = async () => {
        const { user } = confirmToggle
        try {
            await userApi.toggleUserActive(user.id)
            showToast(user.isActive ? t('modal.status_inactive_alert', { name: user.username }) : t('modal.status_active_alert', { name: user.username }))
            loadUsers()
        } catch (error) {
            showToast(t('modal.action_failed'), 'error')
        } finally {
            setConfirmToggle({ show: false, user: null })
        }
    }

    if (loading && users.length === 0) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />
    }

    return (
        <div className="user-list-page page">
            <div className="page-header">
                <div className="title-section">
                    <p className="subtitle">{t('nav.users')}: {filteredAndSortedUsers.length}</p>
                </div>
                <div className="header-actions">
                    <SearchBar
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Tìm theo tên, email, vai trò..."
                    />
                    <button className="add-btn" onClick={handleCreate}>
                        <Icon name="plus" size={18} /> <span className="desktop-only">{t('action.add_new')}</span>
                    </button>
                </div>
            </div>

            <div className="users-table-container glass-card">
                {paginatedUsers.length > 0 ? (
                    <>
                        <table className="users-table desktop-only">
                            <thead>
                                <tr>
                                    <th className="sortable" onClick={() => requestSort('username')}>
                                        {t('auth.username')} {getSortIcon('username')}
                                    </th>
                                    <th>Email</th>
                                    <th className="sortable" onClick={() => requestSort('role')}>
                                        {t('common.role')} {getSortIcon('role')}
                                    </th>
                                    <th>{t('common.status')}</th>
                                    <th className="text-right">{t('common.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className={!user.isActive ? 'is-inactive' : ''}>
                                        <td>
                                            <div className="user-info">
                                                <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                                                <span className="username">{user.username}</span>
                                            </div>
                                        </td>
                                        <td>{user.email || '---'}</td>
                                        <td>
                                            <Badge variant={user.role === 'Admin' ? 'warning' : 'info'} size="sm">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge variant={user.isActive ? 'success' : 'draft'} size="sm">
                                                {user.isActive ? t('form.active') : t('form.locked')}
                                            </Badge>
                                        </td>
                                        <td className="text-right">
                                            <div className="actions">
                                                <button className="icon-btn" onClick={() => handleEdit(user)} title="Sửa">
                                                    <Icon name="edit" size={18} />
                                                </button>
                                                <button
                                                    className={`icon-btn ${user.isActive ? 'danger' : 'success'}`}
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.isActive ? 'Khóa' : 'Mở khóa'}
                                                >
                                                    <Icon name={user.isActive ? 'lock' : 'unlock'} size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="users-mobile-list mobile-only">
                            {paginatedUsers.map(user => (
                                <div key={user.id} className={`user-mobile-card glass-card ${!user.isActive ? 'is-inactive' : ''}`}>
                                    <div className="card-header">
                                        <div className="user-info">
                                            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                                            <div className="names">
                                                <span className="username">{user.username}</span>
                                                <span className="email">{user.email || 'No email'}</span>
                                            </div>
                                        </div>
                                        <div className="status">
                                            <Badge variant={user.isActive ? 'success' : 'draft'} size="xs">
                                                {user.isActive ? t('form.active') : t('form.locked')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="role-tag">
                                            <Badge variant={user.role === 'Admin' ? 'warning' : 'info'} size="xs">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="card-actions">
                                            <button className="action-btn" onClick={() => handleEdit(user)}>
                                                <Icon name="edit" size={18} /> {t('action.edit')}
                                            </button>
                                            <button
                                                className={`action-btn ${user.isActive ? 'danger' : 'success'}`}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                <Icon name={user.isActive ? 'lock' : 'unlock'} size={18} />
                                                {user.isActive ? t('modal.confirm_disable') : t('modal.confirm_enable')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            totalItems={filteredAndSortedUsers.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                        />
                    </>
                ) : (
                    <div className="empty-state-container">
                        <Icon name="search" size={48} />
                        <h3>{t('modal.no_result')}</h3>
                        <p>{t('modal.no_match')}</p>
                        <button className="text-btn" onClick={() => { setSearchQuery(''); setCurrentPage(1); }}>{t('modal.clear_search')}</button>
                    </div>
                )}
            </div>

            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false)
                        loadUsers()
                    }}
                />
            )}

            <ConfirmModal
                show={confirmToggle.show}
                title={t('modal.confirm_status_title')}
                message={t('modal.confirm_status_msg', { name: confirmToggle.user?.username })}
                onConfirm={executeToggleStatus}
                onCancel={() => setConfirmToggle({ show: false, user: null })}
                confirmText={confirmToggle.user?.isActive ? t('modal.confirm_disable') : t('modal.confirm_enable')}
                type={confirmToggle.user?.isActive ? 'danger' : 'default'}
            />
        </div>
    )
}
