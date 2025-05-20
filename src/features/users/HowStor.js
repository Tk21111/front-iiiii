import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listHowVeg, listHowMeat } from './comp/menu';
import Header from '../../components/Header';

const HowStor = () => {
    const { type } = useParams();
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('text'); // Initialize with a default value

    let content;

    // Set the content based on the type from URL params
    if (type === 'veg') {
        content = listHowVeg;
    } else if (type === 'meat') {
        content = listHowMeat;
    } else {
        content = []; // Handle unexpected type
    }

   
    // Filter content based on search input
    if (search) {
        content = content.filter(item => item["name"].toLowerCase().includes(search.toLowerCase()));
    }

    return (
        <div className='page'>
            <Header />
            <div className='content' >
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'>{type === 'veg' ? <Link to="/store/veg" >Vegetables & Friuts</Link>: <Link to="/store/meat" >Meat</Link> }</p>
            </div>
            <div className="food-waste-list">
                {/* Search component */}
                <div className="search">
                    <img src={require('../../components/img/search.png')} alt="icon" style={{ marginLeft: '8px' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                    />
                </div>
                <select
                    className="selection"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="text">Text</option>
                    <option value="tag">Tag</option>
                </select>
            </div>
            {/* Render filtered content */}
            <div className="content-list">
                {content.map((obj, index) => (
                    <article key={index} style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <h2>{obj["name"]}</h2>
                        <h2>{obj["des"]}</h2>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default HowStor;
