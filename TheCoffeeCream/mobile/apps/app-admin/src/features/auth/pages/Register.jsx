import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from '@thecoffeecream/ui-shared'
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
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            // Assuming API URL from environment or hardcoded for now matching default setup
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

            const response = await fetch(`${apiUrl}/Auth/register-shop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            // Redirect to login with success message (could use state to show toast)
            navigate('/login', { state: { message: 'Registration successful! Please check your email to verify your account.' } })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
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
                        <h1 className="brand-name">Create Account</h1>
                        <p>Register your shop and start managing</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">

                        <h3 className="section-title">Shop Information</h3>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Shop Code</label>
                                <input type="text" name="shopCode" required value={formData.shopCode} onChange={handleChange} placeholder="Enter shop code" />
                            </div>
                            <div className="form-group half">
                                <label>Shop Name</label>
                                <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} placeholder="Enter shop name" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Enter address" />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Phone Number</label>
                                <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone" />
                            </div>
                            <div className="form-group half">
                                <label>Shop Email</label>
                                <input type="email" name="shopEmail" required value={formData.shopEmail} onChange={handleChange} placeholder="Enter shop email" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tax Code</label>
                            <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} placeholder="Enter tax code" />
                        </div>

                        <div className="form-group">
                            <label>Subscription Plan</label>
                            <select name="planType" value={formData.planType} onChange={handleChange}>
                                <option value="TRIAL_15_DAYS">Trial (15 Days)</option>
                                <option value="BASIC_30_DAYS">Basic (30 Days)</option>
                                <option value="PREMIUM_6_MONTHS">Premium (6 Months)</option>
                                <option value="PREMIUM_1_YEAR">Premium (1 Year)</option>
                            </select>
                        </div>

                        <h3 className="section-title">Admin Account</h3>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Username</label>
                                <input type="text" name="adminUsername" required value={formData.adminUsername} onChange={handleChange} placeholder="Enter username" />
                            </div>
                            <div className="form-group half">
                                <label>Email</label>
                                <input type="email" name="adminEmail" required value={formData.adminEmail} onChange={handleChange} placeholder="Enter email" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Password</label>
                                <input type="password" name="adminPassword" required value={formData.adminPassword} onChange={handleChange} placeholder="••••••" />
                            </div>
                            <div className="form-group half">
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" />
                            </div>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <button type="submit" disabled={loading} className={`register-btn ${loading ? 'loading' : ''}`}>
                            {loading ? <div className="spinner"></div> : 'Register'}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
