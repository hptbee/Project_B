import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './VerifyEmail.scss'

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('verifying') // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token')
            if (!token) {
                setStatus('error')
                setMessage('No verification token provided.')
                return
            }

            try {
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
                const response = await fetch(`${apiUrl}/Auth/verify-email?token=${token}`)

                if (!response.ok) {
                    throw new Error('Verification failed')
                }

                setStatus('success')
                setMessage('Email verified successfully! You can now log in.')
            } catch (err) {
                setStatus('error')
                setMessage('Verification failed. The link may be invalid or expired.')
            }
        }

        verifyToken()
    }, [searchParams])

    return (
        <div className="verify-page">
            <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="verify-container">
                <div className="verify-card">
                    <div className={`icon-wrapper ${status}`}>
                        {status === 'verifying' && <div className="spinner"></div>}
                        {status === 'success' && <i className="fas fa-check">✔</i>}
                        {status === 'error' && <i className="fas fa-times">✖</i>}
                    </div>

                    <h2 className="title">
                        {status === 'verifying' && 'Verifying...'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Error'}
                    </h2>
                    <p className="message">{message}</p>

                    {status !== 'verifying' && (
                        <button onClick={() => navigate('/login')} className="login-btn">
                            Back to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
