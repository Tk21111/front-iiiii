import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenterView from '../../components/OverlayView';

const NotesExcerptSmall = ({ i , donate , select ,name}) => {
    const username = useSelector(selectCurrentUser);

    const [getAllNoteUser] = useGetAllNoteUserMutation();
    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false)

    
    const [overray , setOverray] = useState(false);
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
        <div onClickCapture= {() => setOverray(true)}class="food-waste-item-vertical">
            <OverayCenterView imgPath={imagePath} dataFood={i} open={overray} onClose={() => setOverray(false)} donate={donate} select={select} name={name} />
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
