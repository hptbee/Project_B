import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from '@thecoffeecream/ui-shared'
import AuthToggles from '../components/AuthToggles'
import logo from '@/assets/icons/logo.png'
import './Register.scss'

export default function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        shopCode: '',
        shopName: '',
        address: '',
        phoneNumber: '',
        shopEmail: '',
        taxCode: '',
        planType: 'TRIAL_15_DAYS',
        adminUsername: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.adminPassword !== formData.confirmPassword) {
            setError(t('auth.pass_mismatch'))
            return
        }

        setLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
            const response = await fetch(`${apiUrl}/Auth/register-shop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || t('common.error'))
            }

            navigate('/login', { state: { message: t('auth.register_success') } })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const [plans, setPlans] = useState([])
    const [loadingPlans, setLoadingPlans] = useState(true)

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
            const response = await fetch(`${apiUrl}/Plans`)
            if (response.ok) {
                const data = await response.json()
                setPlans(data)

                // Find default plan
                const defaultPlan = data.find(p => p.isDefault)
                if (defaultPlan) {
                    setFormData(prev => ({ ...prev, planType: defaultPlan.code }))
                } else if (data.length > 0) {
                    // Fallback to first plan
                    setFormData(prev => ({ ...prev, planType: data[0].code }))
                }
            }
        } catch (err) {
            console.error("Failed to fetch plans", err)
        } finally {
            setLoadingPlans(false)
        }
    }

    return (
        <div className="register-page">
            <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="brand-logo-wrapper">
                            <img src={logo} alt="Logo" className="brand-logo" />
                        </div>
                        <h1 className="brand-name">{t('auth.register_title')}</h1>
                        <p>{t('auth.register_subtitle')}</p>
                        <AuthToggles />
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">

                        <h3 className="section-title">{t('auth.shop_info')}</h3>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>{t('register.shop_code')}</label>
                                <input type="text" name="shopCode" required value={formData.shopCode} onChange={handleChange} placeholder={t('register.enter_shop_code')} />
                            </div>
                            <div className="form-group half">
                                <label>{t('register.shop_name')}</label>
                                <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} placeholder={t('register.enter_shop_name')} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('register.address')}</label>
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder={t('register.enter_address')} />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>{t('register.phone')}</label>
                                <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder={t('register.enter_phone')} />
                            </div>
                            <div className="form-group half">
                                <label>{t('register.email')}</label>
                                <input type="email" name="shopEmail" required value={formData.shopEmail} onChange={handleChange} placeholder={t('register.enter_email')} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('register.tax_code')}</label>
                            <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} placeholder={t('register.enter_tax')} />
                        </div>

                        <div className="form-group">
                            <label>{t('register.plan')}</label>
                            <select
                                name="planType"
                                value={formData.planType}
                                onChange={handleChange}
                                disabled={true}
                            >
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.code}>
                                        {plan.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <h3 className="section-title">{t('auth.admin_account')}</h3>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>{t('auth.username')}</label>
                                <input type="text" name="adminUsername" required value={formData.adminUsername} onChange={handleChange} placeholder={t('register.enter_username')} />
                            </div>
                            <div className="form-group half">
                                <label>{t('register.email')}</label>
                                <input type="email" name="adminEmail" required value={formData.adminEmail} onChange={handleChange} placeholder={t('register.enter_email')} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>{t('auth.password')}</label>
                                <input type="password" name="adminPassword" required value={formData.adminPassword} onChange={handleChange} placeholder="••••••" />
                            </div>
                            <div className="form-group half">
                                <label>{t('auth.confirm_password')}</label>
                                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" />
                            </div>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <button type="submit" disabled={loading} className={`register-btn ${loading ? 'loading' : ''}`}>
                            {loading ? <div className="spinner"></div> : t('register.register_btn')}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            {t('auth.have_account')} <Link to="/login">{t('auth.login')}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
