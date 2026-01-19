import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const ReportForm = ({ type }) => {
    const isLost = type === 'lost';
    const [formData, setFormData] = useState({
        name: '',
        item: '', // maps to 'name' in backend but 'item' in UI
        location: '',
        contact: '',
        date: '',
        description: '',
        photo: null // File upload not implemented fully yet, storing string or ignoring
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type,
                name: formData.item, // mapping 'item' field to 'name'
                date: formData.date,
                title: formData.item,
                location: formData.location,
                description: formData.description,
                contact: formData.contact,
                imageUrl: ""
            };
            // The original form has 'Name' (user name) and 'Item Name'. Backend expects 'name' (user?) and 'title' (item?).
            // Let's adjust: Backend Name -> User Name, Backend Title -> Item Name.
            // Re-mapping:
            payload.name = formData.name; // User name
            payload.title = formData.item; // Item name

            await axios.post(`${API_URL}/items/${type}`, payload);
            alert('Item reported successfully!');
            // Refresh items or clear form
            setFormData({
                name: '',
                item: '',
                location: '',
                contact: '',
                date: '',
                description: '',
                photo: null
            });
            window.location.reload();
        } catch (error) {
            console.error('Error reporting item:', error);
            alert('Error reporting item');
        }
    };

    return (
        <section id={isLost ? "Report-Lost" : "Report-Found"}>
            <h2 id={isLost ? "Reportlosthead" : "Reportfoundhead"}>
                <span>{isLost ? "Report Lost Item" : "Report Found Item"}</span>
            </h2>

            <div className={isLost ? "reportform" : "reportform-found"}>
                <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />

                    <label htmlFor={isLost ? "item" : "fitem"}>Item Name:</label>
                    <input type="text" id={isLost ? "item" : "fitem"} placeholder="Enter item name"
                        value={isLost ? formData.item : formData.fitem}
                        onChange={(e) => setFormData({ ...formData, item: e.target.value })} // unify key
                        required
                    />

                    <label htmlFor={isLost ? "location" : "flocation"}>Location:</label>
                    <input type="text" id={isLost ? "location" : "flocation"} placeholder="Enter location"
                        value={isLost ? formData.location : formData.flocation}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />

                    <label htmlFor="contact">Contact Number:</label>
                    <input type="tel" id="contact" placeholder="Enter contact number"
                        value={formData.contact}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        title="Ten digit mobile number"
                        required
                    />

                    <label htmlFor={isLost ? "date" : "fdate"}>Date:</label>
                    <input type="date" id={isLost ? "date" : "fdate"}
                        value={isLost ? formData.date : formData.fdate}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />

                    <label htmlFor={isLost ? "description" : "fdescription"}>Item Description:</label>
                    <textarea
                        id={isLost ? "description" : "fdescription"}
                        placeholder="Enter item description"
                        value={isLost ? formData.description : formData.fdescription}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    ></textarea>

                    <label htmlFor={isLost ? "photo" : "fphoto"}>Upload Photo:</label>
                    <input type="file" id={isLost ? "photo" : "fphoto"} accept="image/*" />

                    <div className={isLost ? "form-buttons" : "form-buttons-found"}>
                        <button type="submit">Submit</button>
                        <button type="reset" onClick={() => setFormData({})}>Reset</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReportForm;
