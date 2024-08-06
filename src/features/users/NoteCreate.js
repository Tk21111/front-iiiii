import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateNoteMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const { v4: uuid } = require('uuid');

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
        done: false,
        files: []
    }]);

    if (isLoading) return <p>Loading...</p>;

    const canSave = notes.every(note => [note.title, note.expTime, note.tag].every(Boolean) && !isLoading && note.count >= 0 && note.countExp >= 0);

    const handleInputChange = (index, field, value) => {
        //pos note in array
        const updatedNotes = notes.map((note, i) => i === index ? { ...note, [field]: value } : note);
        setNotes(updatedNotes);
    };

    const handleFileChange = (index, files) => {
        const fileArray = Array.from(files);
        const updatedNotes = notes.map((note, i) => i === index ? { ...note, files: fileArray, preview: fileArray.map(file => URL.createObjectURL(file)) } : note);
        setNotes(updatedNotes);
    };

    const handleAddNote = () => {
        setNotes([...notes, {
            title: '',
            expTime: formattedDate,
            count: 0,
            countExp: 0,
            tag: '',
            done: false,
            files: []
        }]);
    };

    const handleRemoveNote = (index) => {
        setNotes(notes.filter((_, i) => i !== index));
    };
    const handleRemoveImage = (index) => {
        // Create a new copy of the notes array to avoid direct state mutation
        const updatedNotes = notes.map((note, i) => {
            if (i === index) {
                return { ...note, files: [], preview: [] };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                const formData = new FormData();
                notes.forEach((note, index) => {
                    formData.append(`notes[${index}][username]`, username);
                    formData.append(`notes[${index}][text]`, note.title);
                    formData.append(`notes[${index}][date]`, note.expTime);
                    formData.append(`notes[${index}][count]`, note.count);
                    formData.append(`notes[${index}][countExp]`, note.countExp);
                    formData.append(`notes[${index}][done]`, note.done);
                    formData.append(`notes[${index}][tag]`, note.tag);
                    note.files.forEach((file) => {
                        formData.append(`notes[${index}][files]`, file);
                    });
                });


                await createNote({
                    formData
                }).unwrap();
                setNotes([{
                    title: '',
                    expTime: formattedDate,
                    count: 0,
                    countExp: 0,
                    tag: '',
                    done: false,
                    files: []
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
                        <label htmlFor={`postFiles-${index}`}>Upload Images:</label>
                        <input
                            type="file"
                            id={`postFiles-${index}`}
                            name={`postFiles-${index}`}
                            multiple
                            onChange={(e) => handleFileChange(index, e.target.files)}
                        />
                        <div>
                            {note?.preview?.map((src, fileIndex) => (
                                <img key={fileIndex} src={src} alt={`preview-${fileIndex}`} style={{ flexGrow: 1, maxWidth: 200 , maxHeight: 200, borderBlockWidth : 1 , borderRadius : 25}} />
                            )) || "no image"}
                        </div>
                        {index > 0 && (
                            <button type="button" onClick={() => handleRemoveNote(index)}>Remove</button>
                        )}
                        {(
                            <button type="button" onClick={() => handleRemoveImage(index)}>Remove Image</button>
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
