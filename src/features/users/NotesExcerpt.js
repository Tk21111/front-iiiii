import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import ConfirmSelection from '../../components/ConfirmSelection';

const PostsExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [getAllNoteUser] = useGetAllNoteUserMutation();
    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)

    const [confirm , setConfirm] = useState(false);
    
    useEffect (()=> {
        if(!note){
            setNote(i);
            setSet(true)
        }
    }, [i,note])

    useEffect(() => {
        const fetchData = async () => {
            if (!note && set){
                try {
                    const result = await getAllNoteUser({ username }).unwrap();
                    setNote(result.entities[Object.keys(i)]);
                    setSet(true)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }    
        };

        fetchData();
    }, [getAllNoteUser , note]);

    let imagePath = null;

    if(i?.images?.length){
        imagePath = `${process.env.REACT_APP_API}/${i?.images?.toString().replace(/\\/g, '/')}`;
    }

    if (!note) {
        return <p>Loading...</p>;
    }
    return (
        <div class="food-waste-item">
            <ConfirmSelection dataFood={i} donate={'false'} open={confirm} onCloseConfirm={()=> setConfirm(false)}/>
            <div className='food-waste-front'>
                <div class="food-waste-date-badge">{i.timeOut.split("T")[0].replace(/-/gi,"/")}</div>
                <img src={imagePath || require('../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details">
                            <ul>
                                <li><h2>{i.text.length > 15 ? i.text.substr(0,15) + "..." : i.text}</h2></li>
                                {i?.donate ? <li><p style={{ color : 'red'}}>donate !!</p></li> : null}
                                <li><p onClickCapture={()=> setConfirm(true)} style={{ textDecoration: 'underline' }}>donate OTHER!! </p></li>
                                <li><p className="postCredit">
                                    <Link to={`note/${i.id}`}>View Post</Link>
                                </p></li>
                            </ul>
                            
                        </div>
                </div> 
            </div>               
    );
};

export default PostsExcerpt;
