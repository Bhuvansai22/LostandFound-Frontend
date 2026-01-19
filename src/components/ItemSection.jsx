import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import API_URL from '../config';

const ItemSection = ({ type }) => {
    const [items, setItems] = useState([]);
    const isLost = type === 'lost';

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${API_URL}/items/${type}`);
                setItems(response.data);
            } catch (error) {
                console.error(`Error fetching ${type} items:`, error);
            }
        };

        fetchItems();
    }, [type]);

    return (
        <section id={isLost ? "Lost-items" : "found-items-section"}>
            <h2 id={isLost ? "losthead" : ""} className={!isLost ? "foundhead" : ""}>
                <span>{isLost ? "Lost Items" : "Found Items"}</span>
            </h2>
            <div className={isLost ? "lost-cont" : "found-cont"}>
                <div className="search-bar">
                    <div className="search-content">
                        <div id="search-menu-toggle">☰</div>
                        <p id="search-item">Item Name</p>
                    </div>
                    <img id="search-icon" src={isLost ? "search.svg" : "/images/search.svg"} alt="" className="search-icon" />
                </div>
            </div>
            <button className={isLost ? "lost-item" : "found-item-btn"} id={isLost ? "lost-btn1" : "found-item-btn"} type="submit"
                onClick={() => {
                    const id = isLost ? 'Report-Lost' : 'Report-Found';
                    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                }}
            >
                Report <img src={isLost ? "/images/lost.svg" : "/images/found.svg"} alt={type} />
            </button>

            <div id={isLost ? "cards" : "found-cards"} className="cards">
                {items.map(item => (
                    <ItemCard key={item._id} item={item} isLost={isLost} />
                ))}
            </div>
        </section>
    );
};

export default ItemSection;
