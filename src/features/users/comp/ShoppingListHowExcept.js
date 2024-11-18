import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "../NoteApiSlice";
import { selectCurrentUser } from '../../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenterView from '../../../components/OverlayView';

const HowExcerpt = ({ i , donate , select ,name , post}) => {
    const username = useSelector(selectCurrentUser);


    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)

    
    const [overray , setOverray] = useState(false);
   

    let imagePath = null;

    if(i?.images?.length){
        imagePath = `${process.env.REACT_APP_API}/${i?.images?.toString().replace(/\\/g, '/')}`;
    }

    console.log(i)

  
    return (
        <div onClickCapture= {() => setOverray(true)}class="exp-child" style={{border: 'black solid 1px' , padding: '2%' , borderRadius: '20px'}} >
            <OverayCenterView imgPath={imagePath} dataFood={i} open={overray} onClose={() => setOverray(false)} donate={donate} select={select} name={name} post={post}/>
            <div className='food-waste-front'>
                <img src={imagePath || require('../../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist-vertical' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details">
                            <ul>
                                <li><p style={{ textAlign: 'left' }}>{i?.name?.length > 7 ? i?.name?.substr(0,5) + "..." : i?.name}</p></li>
                            </ul>
                        </div>
                </div> 
            </div>               
    );
};

export default HowExcerpt;
