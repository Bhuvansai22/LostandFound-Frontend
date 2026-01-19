import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isForgotPassword) {
            try {
                const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
                if (res.data.success) {
                    alert('✅ Password reset email sent! Check your inbox.');
                    setIsForgotPassword(false);
                }
            } catch (error) {
                alert('❌ ' + (error.response?.data?.message || 'Error sending email'));
            }
            return;
        }

        if (isSignup) {
            // Strong password validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                alert('❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
                return;
            }

            // Signup
            const result = await signup(email, password, name);
            if (result.success) {
                alert('✅ Account created successfully! Please check your email for a welcome message.');
                navigate('/profile');
            } else {
                alert('❌ ' + result.message);
            }
        } else {
            // Login
            const result = await login(email, password);
            if (result.success) {
                alert('✅ Login successful!');
                // Redirect admins to admin dashboard, others to profile
                if (result.user.isAdmin) {
                    navigate('/admin', { replace: true });
                } else {
                    const from = location.state?.from?.pathname || '/profile';
                    navigate(from, { replace: true });
                }
            } else {
                alert('❌ ' + result.message);
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#F2F1EF',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background circles */}
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, #D9D2CC 0%, rgba(217, 210, 204, 0.3) 100%)',
                borderRadius: '50%',
                top: '-200px',
                left: '-200px',
                animation: 'float 20s ease-in-out infinite',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'linear-gradient(135deg, rgba(51, 51, 51, 0.1) 0%, rgba(51, 51, 51, 0.05) 100%)',
                borderRadius: '50%',
                bottom: '-150px',
                right: '-150px',
                animation: 'float 15s ease-in-out infinite reverse',
                zIndex: 0
            }}></div>

            <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 241, 239, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '50px 40px',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(217, 210, 204, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
                zIndex: 1,
                animation: 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
            }}>
                {/* Top gradient border */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #D9D2CC 0%, #333 50%, #D9D2CC 100%)'
                }}></div>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    animation: 'fadeInDown 0.8s ease-out 0.2s both'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '8px',
                        letterSpacing: '-0.5px'
                    }}>
                        {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Welcome Back')}
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '15px',
                        margin: 0
                    }}>
                        {isForgotPassword
                            ? 'Enter your email to receive a reset link'
                            : (isSignup ? 'Sign up to get started' : 'Sign in to continue to Lost & Found')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    animation: 'fadeInUp 0.8s ease-out 0.4s both'
                }}>
                    {/* Name Input (only for signup) */}
                    {isSignup && !isForgotPassword && (
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required={isSignup}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #D9D2CC',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    background: '#FFFFFF',
                                    color: '#333',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontFamily: 'Inter, Segoe UI, sans-serif'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(51, 51, 51, 0.1)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#D9D2CC';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            />
                        </div>
                    )}

                    {/* Email Input */}
                    <div style={{ position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: '2px solid #D9D2CC',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                background: '#FFFFFF',
                                color: '#333',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'Inter, Segoe UI, sans-serif'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#333';
                                e.target.style.boxShadow = '0 0 0 4px rgba(51, 51, 51, 0.1)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#D9D2CC';
                                e.target.style.boxShadow = 'none';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        />
                    </div>

                    {/* Password Input (Login/Signup Only) */}
                    {!isForgotPassword && (
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 46px 14px 16px',
                                        border: '2px solid #D9D2CC',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        background: '#FFFFFF',
                                        color: '#333',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        fontFamily: 'Inter, Segoe UI, sans-serif'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#333';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(51, 51, 51, 0.1)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D9D2CC';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: '#666',
                                        padding: '4px'
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Remember & Forgot (only for login) */}
                    {!isSignup && !isForgotPassword && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: '#666'
                            }}>
                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                Remember me
                            </label>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setIsForgotPassword(true);
                            }} style={{
                                color: '#333',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => e.target.style.color = '#666'}
                                onMouseLeave={(e) => e.target.style.color = '#333'}>
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 15px rgba(51, 51, 51, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(51, 51, 51, 0.4)';
                            e.target.style.background = '#1a1a1a';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(51, 51, 51, 0.3)';
                            e.target.style.background = '#333';
                        }}
                    >
                        {isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Create Account' : 'Sign In')}
                    </button>

                    {/* Back to Login (from Forgot Password) */}
                    {isForgotPassword && (
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginTop: '-10px'
                            }}
                        >
                            Back to Login
                        </button>
                    )}
                </form>

                {/* Toggle Sign up/Login */}
                {!isForgotPassword && (
                    <p style={{
                        textAlign: 'center',
                        marginTop: '32px',
                        color: '#666',
                        fontSize: '14px',
                        animation: 'fadeIn 0.8s ease-out 1s both'
                    }}>
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setIsSignup(!isSignup);
                            setName('');
                            setEmail('');
                            setPassword('');
                        }} style={{
                            color: '#333',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }} onMouseEnter={(e) => e.target.style.color = '#666'}
                            onMouseLeave={(e) => e.target.style.color = '#333'}>
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </a>
                    </p>
                )}
            </div>

            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(120deg); }
                    66% { transform: translate(-20px, 20px) rotate(240deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;
