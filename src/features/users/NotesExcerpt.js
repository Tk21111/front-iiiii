import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllnoteQuery } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import ConfirmSelection from '../../components/ConfirmSelection';
import UpdateAmount from '../../components/OverlayNoteAmountUpdate';
import { translate } from '../../hooks/translator';

const PostsExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const navigate = useNavigate()

    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)

    const [confirm , setConfirm] = useState(false);
    const [update , setUpdate] = useState(false);
    

    let imagePath ;;

    if(i?.images?.length){
        imagePath = i.images.map(val => val.url)[0];
    }

    if (!i) {
        return <p>Loading...</p>;
    }
    return (
        <div class="food-waste-item" style={{height : '150px'}} >
            <ConfirmSelection dataFood={i} donate={'false'} open={confirm} onCloseConfirm={()=> setConfirm(false)}/>
            <UpdateAmount note={i} onCloseConfirm={()=> setUpdate(false)} open={update}/>
            <div className='food-waste-front'>
                <div class="food-waste-date-badge"  style={{height : '35px' , fontSize: '70%' , justifyContent: 'center'}} >{(i?.timeOut?.split("T")[0]?.replace(/-/gi,"/") || "no data")}</div>
                <img src={imagePath || require('../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details" style={{fontSize : '55%'}}>
                            <ul>
                                <div className='tag-container' style={{marginLeft : '0px' , paddingLeft : '0px'}}>
                                    <li><h2>{i.text.length > 15 ? i.text.substr(0,15) + "..." : i.text + " : " + (i.count[i.count.length - 1 ] - i.countExp[i.countExp.length - 1 ]) + " " + (i?.typeCount || '')}</h2></li>
                                    <div className='icon-container'>
                                        <button onClick={() => setUpdate(true)} className='small-button'>{translate("edit")}</button>
                                        <div className='hover-description'>กดเพื่อแก้ไขจำนวน</div>
                                    </div>
                                </div>
                                <div>
                                    {i?.donate ? <li><p style={{ color : 'red'}}>donate !!</p></li> : null}
                                <li><p onClickCapture={()=> setConfirm(true)} style={{ textDecoration: 'underline' }}>{translate('giveToanother')}</p></li>
                                <li><p onClickCapture={()=> navigate(`note/${i.id}`)} style={{ textDecoration: 'underline' }}>view all</p></li>
                       
                                </div>
                            </ul>
                            
                        </div>
                </div> 
            </div>               
    );
};

export default PostsExcerpt;
