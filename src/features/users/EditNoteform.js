import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetAllNoteUserMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const EditPostForm = () => {
    const { noteId } = useParams()
    const navigate = useNavigate()
    console.log(noteId)

    const [updateNote, { isLoading }] = useUpdateNoteMutation()
    const [deletePost] = useDeleteNoteMutation()

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

    const [title, setTitle] = useState('')
    const [ExpTime, setExpTime] = useState(Date)
    const [count, setCount] = useState(0)
    const [countExp, setCountExp] = useState(0)
    const [tag, setTag] = useState([])
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (note) {
            setTitle(note.text ?? 'undefined')
            //down
            setExpTime(
                (note) => {
                    if (note.timeOut) {
                        console.log(note.timeOut)
                        let date = note.timeOut;
                        if (date) {
                            let dateRefactor = date.split('T')[0];
                            return dateRefactor;
                        }
                        return date;
                    } else {
                        return '';
                    }
                }
            );
            
            setCount(note.count ?? 0)
            setCountExp(note.countExp ?? 0)
            setDone(note.done ?? false)
            setTag(note.tag ?? [])
        }
    }, [note]);

    if (isLoadingNotes) return <p>Loading...</p>

    if (!note) {
        return (
            <section>
                <h2>Note not found!</h2>
            </section>
        )
    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onExpTimeChanged = e => setExpTime(e.target.value)
    const oncountChanged = e => setCount(e.target.value)
    const oncountExpChanged = e => setCountExp(e.target.value)
    const ontagChanged = e => setTag(e.target.value)
    const ondoneChanged = e => setDone(e.target.value)

    const canSave = [title, ExpTime , count , countExp , tag].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updateNote({ id: note.id, text : title, date : ExpTime , count ,countExp , done , tag  }).unwrap()

                setTitle('')
                setCount(0)
                setCountExp(0)
                setDone(false)
                setTag([])
                setExpTime('')
                console.log('runed')
                navigate(`/note/${note.id}`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: note.id , username : username  }).unwrap()

            setTitle('')
            setCount(0)
            setCountExp(0)
            setDone(false)
            setTag([])
            setExpTime('')

            navigate('/')
        } catch (err) {
            console.error('Failed to delete the post', err)
        }
    }

    return (
        <section>
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
                <textarea
                    id="postExpTime"
                    name="postExpTime"
                    value={ExpTime}
                    onChange={onExpTimeChanged}
                />
                <label htmlFor="postExpTime">count:</label>
                <textarea
                    id="postExpTime"
                    name="postExpTime"
                    value={count}
                    onChange={oncountChanged}
                />
                <label htmlFor="postExpTime">countExp:</label>
                <textarea
                    id="postExpTime"
                    name="postExpTime"
                    value={countExp}
                    onChange={oncountExpChanged}
                />
                <label htmlFor="postExpTime">Tag:</label>
                <textarea
                    id="postExpTime"
                    name="postExpTime"
                    value={tag}
                    onChange={ontagChanged}
                />
                <label htmlFor="postExpTime">Done (True / False):</label>
                <textarea
                    id="postExpTime"
                    name="postExpTime"
                    value={done}
                    onChange={ondoneChanged}
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
    )
}

export default EditPostForm
