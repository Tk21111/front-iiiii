import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllnoteQuery, useDeleteNoteMutation, useUpdateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import Header from '../../components/Header';
import { tagList } from './comp/menu';

const EditPostForm = () => {

    //noteId = {noteId} (in App.js)
    const { noteId } = useParams();
    const navigate = useNavigate();

    const [updateNote, { isLoading }] = useUpdateNoteMutation();
    const [deletePost , {isLoading : isDeleting}] = useDeleteNoteMutation();

    const username = useSelector(selectCurrentUser);
    const  { data : note , isLoading: isLoadingNotes }= useGetAllnoteQuery();
   

    const [title, setTitle] = useState('');
    const [expTime, setExpTime] = useState('');
    const [count, setCount] = useState(0);
    const [countExp, setCountExp] = useState(0);
    const [typeCount, setTypeCount] = useState('kg');
    const [tag, setTag] = useState('');
    const [done, setDone] = useState(false);
    const [id, setId] = useState(false);

    useEffect(() => {
        if (note) {
            const Tmp = note.entities[noteId]
            setTitle(Tmp.text ||'');
            setExpTime(Tmp.timeOut ? Tmp.timeOut.split('T')[0] : '');
            setCount(Tmp?.count[Tmp?.count?.length - 1] || 0);
            setCountExp(Tmp?.countExp[Tmp?.countExp?.length - 1] || 0);
            setTag(Tmp.tag || '');
            setDone(Tmp.done || false);
            setId(Tmp.id || null);
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
                await updateNote({ id: noteId, text: title, date: expTime, count, countExp, done , typeCount, tag: (tag.includes(',') ? tag.split(',') : tag) , update : false}).unwrap();
                navigate(`/user/note/${noteId}`)
            } catch (err) {
                console.error('Failed to save the post', err);
            }
        }
    };

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: id, username }).unwrap();
            navigate('/user');
        } catch (err) {
            console.error('Failed to delete the post', err);
        }
    };

    return (
        <div className='page'>
            <Header/>
            <section>
                <h2>Edit Note</h2>
                <form>
                    <label htmlFor="postTitle">Note Title:</label>
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
                    <label htmlFor="postCount">Amount:</label>
                    <input
                        type="number"
                        id="postCount"
                        name="postCount"
                        value={count}
                        onChange={onCountChanged}
                        max="999"
                        min="0"
                    />
                    <label htmlFor="postCountExp">Amount Exp:</label>
                    <input
                        type="number"
                        id="postCountExp"
                        name="postCountExp"
                        value={countExp}
                        onChange={onCountExpChanged}
                        max="999"
                        min="0"
                    />
                    <label htmlFor="postCountExp">Type Count:</label>
                    <select
                        value={typeCount}
                        onChange={(e) => setTypeCount(e.target.value)}
                        required
                        style={{height : "4vh"  , marginLeft : '1vh' ,marginRight : '1vh', paddingTop: '0.45vi'}}
                    >
                        {tagList.map(p => p)}
                    </select>
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
                        disabled={!canSave || isLoading || isDeleting }
                    >
                        Save Post
                    </button>
                    <button className="deleteButton"
                        type="button"
                        onClick={onDeletePostClicked}
                        disabled={isLoading || isDeleting }
                    >
                        Delete Post
                    </button>
                </form>
            </section>
        </div>
    );
};

export default EditPostForm;
