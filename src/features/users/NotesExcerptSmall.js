import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenterView from '../../components/OverlayView';

const NotesExcerptSmall = ({ i , donate , select ,name , post}) => {

    const [overray , setOverray] = useState(false);
  
    let imagePath ;

    if(i?.images?.length){
        imagePath = `${process.env.REACT_APP_API}/${i?.images?.toString().replace(/\\/g, '/')}`;
    }

    if (!i) {
        return <p>Loading...</p>;
    }
    return (
        <div onClickCapture= {() => setOverray(true)}class="exp-child" style={{border: 'black solid 1px' , padding: '2%' , borderRadius: '20px'}}>
            <OverayCenterView imgPath={imagePath} dataFood={i} open={overray} onClose={() => setOverray(false)} donate={donate} select={select} name={name} post={post}/>
            <div className='food-waste-front'>
                <img src={imagePath || require('../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist-vertical' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details">
                            <ul>
                                <li><p style={{ textAlign: 'left' }}>{i.text.length > 7 ? i.text.substr(0,5) + "..." : i.text}</p></li>
                            </ul>
                        </div>
                </div> 
            </div>               
    );
};

export default NotesExcerptSmall;
