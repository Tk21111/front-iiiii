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

    

    if (!note) {
        return <p>Loading...</p>;
    }
    return (
        <article>
            <h2>{i.text}</h2>
            <p>{i.timeOut}</p>
            <p className="postCredit">
                <Link to={`note/${i.id}`}>View Post</Link>
                <Link to={`/location/create/${i.id}`}> Create sharing location with this food</Link>
                
            </p>
        </article>
    );
};

export default PostsExcerpt;
