import { useState, useEffect } from 'react'
import {
    ShopService,
    Toast,
    LoadingSpinner,
    PageHeaderSkeleton,
    API_CONFIG,
    Icon,
    useTranslation
} from '@thecoffeecream/ui-shared'

export default function ShopSettings() {
    const { t } = useTranslation()
    const [shop, setShop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        loadShop()
    }, [])

    const loadShop = async () => {
        try {
            const data = await ShopService.getMyShop()
            setShop(data)
        } catch (error) {
            setToast({ type: 'error', message: 'Failed to load shop settings' })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const updatedShop = await ShopService.updateMyShop(shop)
            setShop(updatedShop)
            setToast({ type: 'success', message: 'Settings saved successfully' })
        } catch (error) {
            setToast({ type: 'error', message: 'Failed to save settings' })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target
        let val = value
        if (type === 'number') {
            val = parseFloat(value) || 0
        }
        setShop(prev => ({ ...prev, [name]: val }))
    }

    if (loading) return (
        <div className="p-6">
            <PageHeaderSkeleton />
            <div className="mt-8 grid grid-cols-1 gap-6">
                <div className="h-96 bg-base-200 rounded-xl animate-pulse"></div>
            </div>
        </div>
    )

    return (
        <div className="p-6 max-w-4xl mx-auto pb-24">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t('settings.shop_settings')}
                    </h1>
                    <p className="text-base-content/60 mt-1">{t('settings.shop_settings_desc')}</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="btn btn-primary gap-2"
                >
                    {saving ? <LoadingSpinner size="sm" /> : <Icon name="save" />}
                    {t('common.save_changes')}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Info Card */}
                <div className="card glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        {t('settings.general_info')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('register.shop_name')}</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={shop?.name || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('register.phone')}</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={shop?.phoneNumber || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                            />
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text">{t('register.address')}</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={shop?.address || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('register.email')}</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={shop?.email || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('register.tax_code')}</span>
                            </label>
                            <input
                                type="text"
                                name="taxCode"
                                value={shop?.taxCode || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                            />
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text">{t('settings.logo_url')}</span>
                            </label>
                            <input
                                type="text"
                                name="logoUrl"
                                value={shop?.logoUrl || ''}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                    </div>
                </div>

                {/* Tax & Fees Card */}
                <div className="card glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-secondary rounded-full"></span>
                        {t('settings.tax_fees')}
                    </h2>

                    <div className="alert alert-info bg-info/10 text-info border-info/20 mb-6 font-medium text-sm">
                        <Icon name="info" className="text-lg" />
                        <span>{t('settings.tax_fees_desc')}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('settings.vat_rate')}</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="vatRate"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={shop?.vatRate || 0}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:input-secondary pr-8"
                                />
                                <span className="absolute right-3 top-3 text-base-content/50">%</span>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('settings.surcharge_rate')}</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="surchargeRate"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={shop?.surchargeRate || 0}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:input-secondary pr-8"
                                />
                                <span className="absolute right-3 top-3 text-base-content/50">%</span>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">{t('settings.service_charge')}</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="serviceChargeRate"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={shop?.serviceChargeRate || 0}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:input-secondary pr-8"
                                />
                                <span className="absolute right-3 top-3 text-base-content/50">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
