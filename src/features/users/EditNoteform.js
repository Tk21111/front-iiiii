import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllNoteUserMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const EditPostForm = () => {

    //noteId = {noteId} (in App.js)
    const { noteId } = useParams();
    const navigate = useNavigate();

    const [updateNote, { isLoading }] = useUpdateNoteMutation();
    const [deletePost] = useDeleteNoteMutation();

    const username = useSelector(selectCurrentUser);
    const [getAllNoteUser, { isLoading: isLoadingNotes }] = useGetAllNoteUserMutation();
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

    const [title, setTitle] = useState('');
    const [expTime, setExpTime] = useState('');
    const [count, setCount] = useState(0);
    const [countExp, setCountExp] = useState(0);
    const [tag, setTag] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.text ?? '');
            setExpTime(note.timeOut ? note.timeOut.split('T')[0] : '');
            setCount(note.count ?? 0);
            setCountExp(note.countExp ?? 0);
            setTag(note.tag ?? '');
            setDone(note.done ?? false);
        }
    }, [note]);

    if (isLoadingNotes) return <p>Loading...</p>;

    if (!note) {
        return (
            <section>
                <h2>Note not found!</h2>
            </section>
        );
    }

    const onTitleChanged = e => setTitle(e.target.value);
    const onExpTimeChanged = e => setExpTime(e.target.value);
    const onCountChanged = e => setCount(Number(e.target.value));
    const onCountExpChanged = e => setCountExp(Number(e.target.value));
    const onTagChanged = e => setTag(e.target.value);
    const onDoneChanged = e => setDone(e.target.checked);

    const canSave = [title, expTime, tag].every(Boolean) && !isLoading && count >= 0 && countExp >= 0;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updateNote({ id: note.id, text: title, date: expTime, count, countExp, done, tag: tag.split(',') }).unwrap();
                navigate(`/user/note/${note.id}`)
            } catch (err) {
                console.error('Failed to save the post', err);
            }
        }
    };

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: note.id, username }).unwrap();
            navigate('/user');
        } catch (err) {
            console.error('Failed to delete the post', err);
        }
    };

    return (
        <section>
            <p><Link to="/user"> Food List </Link></p>
            <p><Link to="/welcome"> Home </Link></p>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postExpTime">ExpTime:</label>
                <input
                    type="date"
                    id="postExpTime"
                    name="postExpTime"
                    value={expTime}
                    onChange={onExpTimeChanged}
                />
                <label htmlFor="postCount">Count:</label>
                <input
                    type="number"
                    id="postCount"
                    name="postCount"
                    value={count}
                    onChange={onCountChanged}
                    max="999"
                    min="0"
                />
                <label htmlFor="postCountExp">CountExp:</label>
                <input
                    type="number"
                    id="postCountExp"
                    name="postCountExp"
                    value={countExp}
                    onChange={onCountExpChanged}
                    max="999"
                    min="0"
                />
                <label htmlFor="postTag">Tag:</label>
                <input
                    type="text"
                    id="postTag"
                    name="postTag"
                    value={tag}
                    onChange={onTagChanged}
                />
                <label htmlFor="postDone">Done (True / False):</label>
                <input
                    type="checkbox"
                    id="postDone"
                    name="postDone"
                    checked={done}
                    onChange={onDoneChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    );
};

export default EditPostForm;
