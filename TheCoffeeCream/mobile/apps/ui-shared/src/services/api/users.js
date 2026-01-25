import { apiFetch } from './client'

export const usersApi = {
    getAllUsers: () => apiFetch('/Users'),
    getUserById: (id) => apiFetch(`/Users/${id}`),
    createUser: (userData) => apiFetch('/Users', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    updateUser: (id, userData) => apiFetch(`/Users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    }),
    toggleUserActive: (id) => apiFetch(`/Users/${id}/toggle`, {
        method: 'PATCH'
    })
}
