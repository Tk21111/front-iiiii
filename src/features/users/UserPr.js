import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUpdateUserMutation } from './NoteApiSlice';
import Header from '../../components/Header';

const ProfileUpdateForm = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [more, setMore] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

        setImages((prevImages) => [...prevImages, ...selectedFiles]);
        setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
    };

    const handleImageRemove = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        if (username) {
            formData.append('username', username);
        }
        if (more) {
            formData.append('more', more);
        }
        if (images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        await updateUser({ formData });

        // Clear form fields after submission
        setImages([]);
        setImagePreviews([]);
        setMore('');
        setUsername('');
        navigate(`/welcome`)
    };

    return (
        <div className='page'>
            <Header/>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={{ display: 'flex', flexDirection: 'column', height: 200 }}>
                    <label>Username:</label>
                    <label style={{ color: 'red', fontWeight: 'bold', margin: 10 }}>
                        Notice that your username when logging in will not change
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <label>More Info:</label>
                    <textarea
                        value={more}
                        onChange={(e) => setMore(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label>Upload Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                    {imagePreviews.map((url, index) => (
                        <div key={index} style={{ marginBottom: '10px', position: 'relative' }}>
                            <img
                                src={url}
                                alt={`preview ${index}`}
                                style={{ maxHeight: '100px', maxWidth: '100px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} // Optional: Disable button during loading
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdateForm;
