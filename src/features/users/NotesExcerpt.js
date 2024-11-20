import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import ConfirmSelection from '../../components/ConfirmSelection';
import UpdateAmount from '../../components/OverlayNoteAmountUpdate';

const PostsExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)

    const [confirm , setConfirm] = useState(false);
    const [update , setUpdate] = useState(false);
    

    let imagePath ;;

    if(i?.images?.length){
        imagePath = `${process.env.REACT_APP_API}/${i?.images?.toString().replace(/\\/g, '/')}`;
    }

    if (!i) {
        return <p>Loading...</p>;
    }
    return (
        <div class="food-waste-item" style={{height : '150px'}}>
            <ConfirmSelection dataFood={i} donate={'false'} open={confirm} onCloseConfirm={()=> setConfirm(false)}/>
            <UpdateAmount note={i} onCloseConfirm={()=> setUpdate(false)} open={update}/>
            <div className='food-waste-front'>
                <div class="food-waste-date-badge"  style={{height : '35px' , fontSize: '70%' , justifyContent: 'center'}} >{i.timeOut.split("T")[0].replace(/-/gi,"/")}</div>
                <img src={imagePath || require('../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details" style={{fontSize : '55%'}}>
                            <ul>
                                <div className='tag-container' style={{marginLeft : '0px' , paddingLeft : '0px'}}>
                                    <li><h2>{i.text.length > 15 ? i.text.substr(0,15) + "..." : i.text + " : " + (i.count[i.count.length - 1 ] - i.countExp[i.countExp.length - 1 ])}</h2></li>
                                    <button onClick={() => setUpdate(true)} className='small-button'>edit</button>
                                </div>
                                <div>
                                    {i?.donate ? <li><p style={{ color : 'red'}}>donate !!</p></li> : null}
                                    <li><p onClickCapture={()=> setConfirm(true)} style={{ textDecoration: 'underline' }}>Give to another </p></li>
                                    <li><p className="postCredit">
                                        <Link to={`note/${i.id}`}>View Note</Link>
                                    </p></li>
                                </div>
                            </ul>
                            
                        </div>
                </div> 
            </div>               
    );
};

export default PostsExcerpt;
