import { apiFetch, API_BASE } from './client';

export const MenuService = {
    exportMenu: async () => {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/MenuImportExport/export`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Export failed');
        return response.blob();
    },

    importMenu: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE}/MenuImportExport/import`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || 'Import failed');
        }
        return response.json();
    }
};
