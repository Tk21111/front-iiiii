import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUpdateUserMutation } from '../NoteApiSlice';
import Header from '../../../components/Header';
import { useSelector } from 'react-redux';
import { selectCurrentAka, selectCurrentImage, selectCurrentUser } from '../../auth/authSlice';

const ProfileUpdateForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [more, setMore] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const user = useSelector(selectCurrentUser);
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);

    const imagePath = image?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    const [updateUser, { isLoading, error }] = useUpdateUserMutation();

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

        try {
            await updateUser({ formData }).unwrap();
            setImages([]);
            setImagePreviews([]);
            setMore('');
            setUsername('');
            navigate(`/welcome`);
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    return (
        <div className='page'>
            <Header />
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="profile-update-form">
                <div className="form-section">
                    <label htmlFor="aka">Aka:</label>
                    <h2>{aka}</h2>
                    {imagePath?.map((val, index) => (
                        <img key={index} src={val} alt="User Avatar" className="user-avatar" />
                    ))}
                    <label className="warning-label">
                        Notice that your username when logging in will not change
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="more">More Info:</label>
                    <textarea
                        id="more"
                        value={more}
                        onChange={(e) => setMore(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-section">
                    <label htmlFor="images">Upload Images:</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                <div className="image-previews">
                    {imagePreviews.map((url, index) => (
                        <div key={index} className="image-preview">
                            <img
                                src={url}
                                alt={`preview ${index}`}
                                className="preview-img"
                            />
                            <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="remove-button"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                {error && <p className="error-message">Failed to update profile. Please try again.</p>}

                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdateForm;
