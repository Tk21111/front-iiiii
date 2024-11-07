import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayControl';


const PostsExcerpt = ({i}) => {



    const navigate = useNavigate();

    const user = useSelector(selectCurrentUser);

    console.log(i)
    if (!i) {
        return <p>Location not found</p>;
    }
    const imagePath = i?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
    return (
        
        
            
            <div className="food-waste-item">
                <div className='food-waste-front'>
                    <img src={require('../../components/img/home.png')} alt="meat icon" className='smalllogolist' />
                </div>
                <div className='overcontent'>
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                <ul>
                                    <li>{i?.content}</li>
                                    <li>{i?.like?.length - i?.unlike?.length}</li>
                                    <li><Link style={{color : 'black'}} to={`/post/${i?.id}`}>to single </Link></li>
                                </ul>
                            </div>
                            
                    </div>
                </div> 
            </div>
            
            
        
        
    );
};

export default PostsExcerpt;

/*<div>
                <h2>{text}</h2>
                <p>{loca.town}</p>
                <p>{"Have : " + loca.num}</p>
                <p>{"Exp date : " + loca.exp}</p>
                <p>{loca.aka}</p>
                <p>{"Getter name : " + loca.getP || 'not allowed to see'}</p>
                {loca.getPId? <Link to={`/getuser/${loca.getPId}`}>that person</Link> : <p>no data</p>}
            </div>
            <div>
                {imagePath.map((path, i) => (
                    <img
                        key={i}
                        src={path}
                        alt={`note image ${i}`}
                        style={{ flexGrow: 1, maxWidth: '20%', maxHeight: '20%' }}
                    />
                ))}
                <p style={{color: 'red'}}>{loca.organisation ? "organisation" : "user"}</p>
            </div>
            <p className="postCredit">
                <Link to={`/location/${loca.id}`}>View Post</Link>
            </p>
            */