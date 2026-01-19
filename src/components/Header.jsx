import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout, currentUser } = useAuth();

    return (
        <header>
            <div className="box" id="box">
                <div className="logo-content">
                    <img id="logo" src="/images/logo.svg" alt="logo" />
                    <div className="logo-name">
                        <h4>PESCE</h4>
                        <p>Lost & Found</p>
                    </div>
                </div>
                <div id="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</div>
                <div id="items" className={isOpen ? "active" : ""}>
                    <ul id="header-content">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/lost">Lost</Link></li>
                        <li><Link to="/report-lost">Report Lost</Link></li>
                        <li><Link to="/found">Found</Link></li>
                        <li><Link to="/report-found">Report Found</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        {currentUser?.isAdmin && (
                            <li><Link to="/admin" style={{ color: '#ff9800', fontWeight: 'bold' }}>⚙️ Admin</Link></li>
                        )}
                        <div className="loginid">
                            {isAuthenticated ? (
                                <button id="login" onClick={logout}>Logout</button>
                            ) : (
                                <Link to="/login"><button id="login">Login</button></Link>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
