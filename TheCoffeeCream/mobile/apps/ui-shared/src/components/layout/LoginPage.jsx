import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import './LoginPage.scss';

/**
 * Shared Login Page Component
 * 
 * @param {Object} props
 * @param {string} props.title - App title (e.g. THE COFFEE CREAM)
 * @param {string} props.subtitle - App subtitle (e.g. Administrator Portal)
 * @param {string} props.version - Version string
 * @param {string} props.logo - Logo image source
 * @param {Function} props.onLogin - Async login callback (username, password)
 * @param {string} props.error - Error message to display
 * @param {boolean} props.loading - Loading state
 */
export function LoginPage({
    title = 'THE COFFEE CREAM',
    subtitle,
    version = '2.0.0',
    logo,
    onLogin,
    error: externalError,
    loading: externalLoading
}) {
    const { t } = useTranslation();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const displaySubtitle = subtitle || t('auth.end_session'); // Dynamic fallback

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(credentials.username, credentials.password);
    };

    return (
        <div className="login-page" data-theme="dark">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        {logo && (
                            <div className="brand-logo-wrapper">
                                <img src={logo} alt={title} className="brand-logo" />
                            </div>
                        )}
                        <div className="brand-name">{title}</div>
                        <p>{displaySubtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">{t('auth.username')}</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder={t('auth.placeholder_user')}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t('auth.password')}</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder={t('auth.placeholder_pass')}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {externalError && <div className="error-alert">{externalError}</div>}

                        <button
                            type="submit"
                            className={`login-btn ${externalLoading ? 'loading' : ''}`}
                            disabled={externalLoading}
                        >
                            {externalLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                t('auth.login')
                            )}
                        </button>
                    </form>

                    <footer className="login-footer">
                        <p>{t('common.developed_by')} <strong>Tung Huynh</strong></p>
                        <p className="version">{t('common.version')} {version}</p>
                    </footer>
                </div>
            </div>

            <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
}
