import { useEffect, useState } from 'react';
import PostsExcerpt from './NotesExcerpt';
import { useGetAllNoteUserMutation , useGetAllnoteQuery } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

import { Link } from 'react-router-dom';

const GetAllNoteUser = () => {
    const user = useSelector(selectCurrentUser);
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    console.log(user);
                    await getAllNoteUser(user);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, hasFetched, user]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        console.log(users);
        const usersEn = users.entities
        console.log(usersEn)
        if (usersEn && Array.isArray(usersEn) && usersEn.length > 0) {
            content = (
                <ul>
                    {usersEn.map((userData, i) => (
                        <li key={i}>{`Food : ${userData.text || 'undefined'}  have : ${userData.count || 'undefined'}  is expired :  ${userData.done || 'undefined'}  timeout : ${userData.timeOut || 'undefined'}  tag : ${userData.tag || 'undefined'}`}</li>
                    ))}
                </ul>
            );
        } else {
            content = <p>No data available.</p>;
        }
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
