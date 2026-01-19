import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

const ReportFound = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fname: '',
        fitem: '',
        flocation: '',
        fdate: '',
        fdescription: '',
        fcontact: '',
        imageUrl: ''
    });

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
                type: 'found',
                name: formData.fname || "Anonymous",
                date: formData.fdate,
                title: formData.fitem,
                location: formData.flocation,
                description: formData.fdescription,
                contact: formData.fcontact || `Contact: ${formData.fname}`,
                imageUrl: formData.imageUrl || "/images/card.svg"
            };

            await axios.post(`${API_URL}/items/found`, payload);
            alert('✅ Found item reported successfully!');

            // Reset form
            setFormData({
                fname: '',
                fitem: '',
                flocation: '',
                fdate: '',
                fdescription: '',
                fcontact: ''
            });

            // Navigate to found items page to see the new item
            navigate('/found');
        } catch (error) {
            console.error('Error reporting item:', error);
            alert('❌ Error reporting item. Please try again.');
        }
    };

    const handleReset = () => {
        setFormData({
            fname: '',
            fitem: '',
            flocation: '',
            fdate: '',
            fdescription: '',
            fcontact: ''
        });
    };

    return (
        <section id="Report-Found">
            <h2 id="Reportfoundhead">
                <span>Report Found Item</span>
            </h2>

            <div className="reportform-found">
                <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                    <label htmlFor="fname">Your Name:</label>
                    <input
                        type="text"
                        id="fname"
                        placeholder="Enter your name"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="fitem">Item Name:</label>
                    <input
                        type="text"
                        id="fitem"
                        placeholder="Enter item name"
                        value={formData.fitem}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="flocation">Location:</label>
                    <input
                        type="text"
                        id="flocation"
                        placeholder="Where did you find it?"
                        value={formData.flocation}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="fdate">Date:</label>
                    <input
                        type="date"
                        id="fdate"
                        min="2026-01-01"
                        max="2030-12-31"
                        value={formData.fdate}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="fdescription">Item Description:</label>
                    <textarea
                        id="fdescription"
                        placeholder="Describe the item in detail"
                        value={formData.fdescription}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <label htmlFor="fcontact">Contact Information:</label>
                    <input
                        type="text"
                        id="fcontact"
                        placeholder="Phone number or email"
                        value={formData.fcontact}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="fphoto">Upload Photo (Optional, max 100KB):</label>
                    <input type="file" id="fphoto" accept="image/*" onChange={handleFileChange} />

                    <div className="form-buttons-found">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReportFound;
