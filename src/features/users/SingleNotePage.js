import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';
import Header from '../../components/Header';

const SinglePostPage = () => {

    const noteId = useParams()


    const URL = '${process.env.REACT_APP_API}/'
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

    const dt1 = new Date(note.timeOut.split('T')[0]);
    const dt2 = new Date();
        
            // Calculate the difference in days
            const diff = Math.floor(
                ((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24)
            );
        


    const imagePath = `${process.env.REACT_APP_API}/${note.images.toString().replace(/\\/g, '/')}`;
    return (
        <div style={{width : '100%' , height : '100%'}}>
            <Header/>
            <div className='single-parent'>
                <div>
                <h2>{note.text}</h2>
                </div>
                <img src={imagePath?.length > 1 ? imagePath :  require('../../components/img/meal.png')} alt="note image" style={{flexGrow: 1 , maxWidth: 300 , maxHeight: 300, margin : "5%"  }} />
                <div>
                <p>Exp date : { diff } left</p>
                <p>In count : {note.count[note.count.length - 1]}</p>
                <p>Exp count : {note.countExp[note.count.length - 1]}</p>
                <p>Is it Exp : {note.done}</p>
                <p>Tag : {note.tag}</p>
                <Link to={`/user/note/edit/${noteId.noteId}`}>Edit Post</Link>
                
                </div>
            </div>
        </div>
    )
}

export default SinglePostPage