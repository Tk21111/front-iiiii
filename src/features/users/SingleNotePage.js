import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';

const SinglePostPage = () => {

    const noteId = useParams()


    const URL = 'http://localhost:3500/'
    const username = useSelector(selectCurrentUser);
    const [getAllNoteUser , { isLoading }] = useGetAllNoteUserMutation();
    const [note, setNote] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllNoteUser({ username }).unwrap();
                setNote(result.entities[noteId.noteId]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, username, noteId]);
    if (isLoading) return <p>Loading...</p>
    if (!note) {
        return (
            <section>
                <h2>note not found!</h2>
            </section>
        )
    }
    console.log(note.path)
    console.log("http://localhost:3500/"  +  note.path.toString().replace(/\\/g, '/'))
    const imagePath = `http://localhost:3500/${note.path.toString().replace(/\\/g, '/')}`;

    return (
        <article>
            <h2>{note.text}</h2>
            <img src={imagePath} alt="note image" style={{flexGrow: 1 , maxWidth: 300 , maxHeight: 300, margin : "5%"  }} />
            <p>Exp date : {note.timeOut}</p>
            <p>In count : {note.count}</p>
            <p>Exp count : {note.countExp}</p>
            <p>Is it Exp : {note.done}</p>
            <p>Tag : {note.tag}</p>
            <p className="postCredit">
                <Link to={`/user/note/edit/${noteId.noteId}`}>Edit Post</Link>
            </p>
            <p><Link to="/user"> Food List </Link></p>
            <p><Link to="/welcome"> Home </Link></p>
        </article>
    )
}

export default SinglePostPage