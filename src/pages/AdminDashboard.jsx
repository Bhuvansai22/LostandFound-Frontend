import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser || !currentUser.isAdmin) {
            alert('Access denied. Admin only.');
            navigate('/');
        }
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: { email: currentUser.email }
            });
            setUsers(res.data);
        } catch (err) {
            alert('Error fetching users: ' + err.response?.data?.message);
        }
        setLoading(false);
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/items`, {
                headers: { email: currentUser.email }
            });
            setItems(res.data);
        } catch (err) {
            alert('Error fetching items: ' + err.response?.data?.message);
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { email: currentUser.email }
            });
            setStats(res.data);
        } catch (err) {
            alert('Error fetching stats: ' + err.response?.data?.message);
        }
        setLoading(false);
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(`${API_URL}/admin/users/${id}`, {
                headers: { email: currentUser.email }
            });
            alert('User deleted successfully');
            fetchUsers();
        } catch (err) {
            alert('Error deleting user: ' + err.response?.data?.message);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await axios.delete(`${API_URL}/admin/items/${id}`, {
                headers: { email: currentUser.email }
            });
            alert('Item deleted successfully');
            fetchItems();
        } catch (err) {
            alert('Error deleting item: ' + err.response?.data?.message);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'items') fetchItems();
        if (activeTab === 'stats') fetchStats();
    }, [activeTab]);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'stats' ? 'active' : ''}
                    onClick={() => setActiveTab('stats')}
                >
                    Statistics
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={activeTab === 'items' ? 'active' : ''}
                    onClick={() => setActiveTab('items')}
                >
                    Items
                </button>
            </div>

            <div className="admin-content">
                {loading && <p>Loading...</p>}

                {activeTab === 'stats' && stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p className="stat-number">{stats.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Items</h3>
                            <p className="stat-number">{stats.totalItems}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Lost Items</h3>
                            <p className="stat-number">{stats.lostItems}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Found Items</h3>
                            <p className="stat-number">{stats.foundItems}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>USN</th>
                                    <th>Admin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.email}</td>
                                        <td>{user.profile?.name || 'N/A'}</td>
                                        <td>{user.profile?.usn || 'N/A'}</td>
                                        <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                className="delete-btn"
                                                disabled={user.isAdmin}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'items' && (
                    <div className="items-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Reporter</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id}>
                                        <td className={item.type}>{item.type.toUpperCase()}</td>
                                        <td>{item.title}</td>
                                        <td>{item.location}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <button
                                                onClick={() => deleteItem(item._id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
