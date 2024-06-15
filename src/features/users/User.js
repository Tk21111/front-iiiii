import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';
import PostsExcerpt from './NotesExcerpt'

import { Link } from 'react-router-dom';

const GetAllNoteUser = () => {
    const user = { "username" : useSelector(selectCurrentUser)};
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {

        //this is what u have to modifine
        //user = {data : ids , entities}

        if(users.ids.length !== 0){
            content = users.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
        } else 
            content = <Link to="/user/note/create">Create yours own note</Link>
        
        
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
        } else {
            msg = JSON.stringify(error);
        }
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    }

    return content;
};


export default GetAllNoteUser;