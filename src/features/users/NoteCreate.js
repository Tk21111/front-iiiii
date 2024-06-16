import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate()
    const username = useSelector(selectCurrentUser);

    // Get the current date and add one month
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Format the date as needed (e.g., 'YYYY-MM-DD')
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const [createNote, { isLoading }] = useCreateNoteMutation()
    const [title, setTitle] = useState('')
    const [expTime, setExpTime] = useState(formattedDate)
    const [count, setCount] = useState(0)
    const [countExp, setCountExp] = useState(0)
    const [tag, setTag] = useState('')
    const [done, setDone] = useState(false)

    if (isLoading) return <p>Loading...</p>

    const onTitleChanged = e => setTitle(e.target.value)
    const onExpTimeChanged = e => setExpTime(e.target.value)
    const onCountChanged = e => setCount(Number(e.target.value))
    const onCountExpChanged = e => setCountExp(Number(e.target.value))
    const onTagChanged = e => setTag(e.target.value)
    const onDoneChanged = e => setDone(e.target.checked)

    const canSave = [title, expTime, tag].every(Boolean) && !isLoading && count >= 0 && countExp >= 0;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await createNote({ username, text: title, date: expTime, count, countExp, done, tag: tag.split(',') }).unwrap()
                setTitle('')
                setExpTime(formattedDate)
                setCount(0)
                setCountExp(0)
                setTag('')
                setDone(false)
                navigate(`/user`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    return (
        <section>
            <p><Link to="/user"> Food List </Link></p>
            <p><Link to="/welcome"> Home </Link></p>
            <h2>Create Note</h2>
            <form>
                <label htmlFor="postTitle">Food name:</label>
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
                <label htmlFor="postDone">Exp?:</label>
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
            </form>
        </section>
    )
}

export default CreatePost
