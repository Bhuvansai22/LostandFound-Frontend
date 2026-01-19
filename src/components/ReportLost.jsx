import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ReportLost = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        item: '',
        location: '',
        date: '',
        description: '',
        contact: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (currentUser && currentUser.profile) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.profile.name || prev.name,
                contact: currentUser.profile.contact || currentUser.email || prev.contact
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 100 * 1024) { // 100KB limit
                alert('File size exceeds 100KB');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type: 'lost',
                name: formData.name,
                date: formData.date,
                title: formData.item,
                location: formData.location,
                description: formData.description,
                contact: formData.contact || `Contact: ${formData.name}`,
                imageUrl: formData.imageUrl || "/images/card.svg"
            };

            await axios.post(`${API_URL}/items/lost`, payload);
            alert('✅ Lost item reported successfully!');

            // Reset form
            setFormData({
                name: '',
                item: '',
                location: '',
                date: '',
                description: '',
                contact: ''
            });

            // Navigate to lost items page to see the new item
            navigate('/lost');
        } catch (error) {
            console.error('Error reporting item:', error);
            alert('❌ Error reporting item. Please try again.');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            item: '',
            location: '',
            date: '',
            description: '',
            contact: ''
        });
    };

    return (
        <section id="Report-Lost">
            <h2 id="Reportlosthead">
                <span>Report Lost Item</span>
            </h2>

            <div className="reportform">
                <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                    <label htmlFor="name">Your Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="item">Item Name:</label>
                    <input
                        type="text"
                        id="item"
                        placeholder="Enter item name"
                        value={formData.item}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        placeholder="Where did you lose it?"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        min="2026-01-01"
                        max="2030-12-31"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="description">Item Description:</label>
                    <textarea
                        id="description"
                        placeholder="Describe the item in detail"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <label htmlFor="contact">Contact Information:</label>
                    <input
                        type="text"
                        id="contact"
                        placeholder="Phone number or email"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="photo">Upload Photo (Optional, max 100KB):</label>
                    <input type="file" id="photo" accept="image/*" onChange={handleFileChange} />

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReportLost;
