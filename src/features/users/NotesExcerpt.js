import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const PostsExcerpt = ({ postId: noteId }) => {
    const username = useSelector(selectCurrentUser);
    const [getAllNoteUser] = useGetAllNoteUserMutation();
    const [note, setNote] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllNoteUser({ username }).unwrap();
                setNote(result.entities[noteId]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, username, noteId]);

    if (!note) {
        return <p>Loading...</p>;
    }

    return (
        <article>
            <h2>{note.text}</h2>
            <p>{note.timeOut}</p>
            <p className="postCredit">
                <Link to={`note/${note.id}`}>View Post</Link>
                <Link to={`note/create`}> Create </Link>
            </p>
        </article>
    );
};

export default PostsExcerpt;
