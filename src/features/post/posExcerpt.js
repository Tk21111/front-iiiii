import React, { useEffect, useState } from 'react';
import { Link , useNavigate, useParams } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayCenter';
import filterEntitiesByTag from '../users/comp/Search';


const PostsExcerpt = ({i}) => {

    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);
    const {user} = useParams()

    //for private conversation
    if(i?.userlist?.length > 0  ){
        if(!(i?.userlist.find(val => val === username))){
            return null
        };

    } 
    if((i?.userlist?.length === 0) && user === 'true' ){
        return null
    }
     //filter reply comment out
     if(i?.reply){
        return null
    }

   

    if (!i) {
        return <p>Location not found</p>;
    }
    const imagePath = i?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
    const imageUserPath = i?.user?.image?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    console.log(i)
    return (
        
        
            
            <div className="food-waste-item">
                <div className='food-waste-front'>
                    <img src={imageUserPath ? imageUserPath[0] : require('../../components/img/home.png')} alt="home icon" className='smalllogolist' />
                    <h2 style={{textAlign : 'center' , fontSize : '90%'}}>{i?.user.aka}</h2>
                </div>
                <div className='overcontent'>
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                
                                    <h2>{i?.title}</h2>
                                    <p>{i?.content}</p>
                                    <h2>{i?.like?.length || 0 - i?.unlike?.length || 0}</h2>
                                    <Link style={{color : 'black'}} to={`/post/false/${(i?.id || i?._id)}`}>to single </Link>
                               
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