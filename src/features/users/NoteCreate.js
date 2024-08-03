import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

    // Get the current date and add one month
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Format the date as needed (e.g., 'YYYY-MM-DD')
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const [createNote, { isLoading }] = useCreateNoteMutation();
    const [notes, setNotes] = useState([{
        title: '',
        expTime: formattedDate,
        count: 0,
        countExp: 0,
        tag: '',
        done: false
    }]);

    if (isLoading) return <p>Loading...</p>;

    const canSave = notes.every(note => [note.title, note.expTime, note.tag].every(Boolean) && !isLoading && note.count >= 0 && note.countExp >= 0);

    const handleInputChange = (index, field, value) => {
        const updatedNotes = notes.map((note, i) => i === index ? { ...note, [field]: value } : note);
        setNotes(updatedNotes);
    };

    const handleAddNote = () => {
        setNotes([...notes, {
            title: '',
            expTime: formattedDate,
            count: 0,
            countExp: 0,
            tag: '',
            done: false
        }]);
    };

    const handleRemoveNote = (index) => {
        setNotes(notes.filter((_, i) => i !== index));
    };

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await createNote(notes.map(note => ({
                    username,
                    text: note.title,
                    date: note.expTime,
                    count: note.count,
                    countExp: note.countExp,
                    done: note.done,
                    tag: note.tag.split(',')
                }))).unwrap();
                setNotes([{
                    title: '',
                    expTime: formattedDate,
                    count: 0,
                    countExp: 0,
                    tag: '',
                    done: false
                }]);
                navigate(`/user`);
            } catch (err) {
                console.error('Failed to save the post', err);
                if (err.originalStatus === 409) {
                    navigate(`/user/note/edit/${err.data.noteId}`);
                } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                    console.error('Network or CORS error: ', err);
                } else {
                    console.error('Unexpected error: ', err);
                }
            }
        }
    };

    return (
        <section>
            <p><Link to="/user">Food List</Link></p>
            <p><Link to="/welcome">Home</Link></p>
            <h2>Create Note</h2>
            <form>
                {notes.map((note, index) => (
                    <div key={index}>
                        <label htmlFor={`postTitle-${index}`}>Food name:</label>
                        <input
                            type="text"
                            id={`postTitle-${index}`}
                            name={`postTitle-${index}`}
                            value={note.title}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        />
                        <label htmlFor={`postExpTime-${index}`}>ExpTime:</label>
                        <input
                            type="date"
                            id={`postExpTime-${index}`}
                            name={`postExpTime-${index}`}
                            value={note.expTime}
                            onChange={(e) => handleInputChange(index, 'expTime', e.target.value)}
                        />
                        <label htmlFor={`postCount-${index}`}>Count:</label>
                        <input
                            type="number"
                            id={`postCount-${index}`}
                            name={`postCount-${index}`}
                            value={note.count}
                            onChange={(e) => handleInputChange(index, 'count', Number(e.target.value))}
                            max="999"
                            min="0"
                        />
                        <label htmlFor={`postCountExp-${index}`}>CountExp:</label>
                        <input
                            type="number"
                            id={`postCountExp-${index}`}
                            name={`postCountExp-${index}`}
                            value={note.countExp}
                            onChange={(e) => handleInputChange(index, 'countExp', Number(e.target.value))}
                            max="999"
                            min="0"
                        />
                        <label htmlFor={`postTag-${index}`}>Tag:</label>
                        <input
                            type="text"
                            id={`postTag-${index}`}
                            name={`postTag-${index}`}
                            value={note.tag}
                            onChange={(e) => handleInputChange(index, 'tag', e.target.value)}
                        />
                        <label htmlFor={`postDone-${index}`}>Exp?:</label>
                        <input
                            type="checkbox"
                            id={`postDone-${index}`}
                            name={`postDone-${index}`}
                            checked={note.done}
                            onChange={(e) => handleInputChange(index, 'done', e.target.checked)}
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => handleRemoveNote(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddNote}>Add Another Note</button>
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
            </form>
        </section>
    );
};

export default CreatePost;
