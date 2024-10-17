import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const PostsExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [getAllNoteUser] = useGetAllNoteUserMutation();
    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)
    
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
        imagePath = `http://localhost:3500/${i?.images?.toString().replace(/\\/g, '/')}`;
    }

    if (!note) {
        return <p>Loading...</p>;
    }
    return (
        <div class="food-waste-item">
            
            <div className='food-waste-front'>
                <div class="food-waste-date-badge">{i.timeOut.split("T")[0].replace(/-/gi,"/")}</div>
                <img src={imagePath || './meal.png'} alt="meat icon" loading="lazy" className='smalllogolist' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details">
                            <ul>
                                <li><p>{i.text}</p></li>
                            </ul>
                            <p className="postCredit">
                                <Link to={`note/${i.id}`}>View Post</Link>
                                <Link to={`/location/create/${i.id}`}> location</Link>
                
                             </p>
                        </div>
                </div> 
            </div>               
    );
};

export default PostsExcerpt;
