import React, { useState } from 'react';
import { useSetHowMutation } from './NoteApiSlice';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const RecommendationCreate = () => {

    const navigate = useNavigate()
    const [setHow, { data, isLoading, isError, error }] = useSetHowMutation();
    const [des, setDes] = useState('');
    const [tag, setTag] = useState('');
    const [pubilc, setPublic] = useState(false);
    const [imagePath, setImagePath] = useState(null); // Assuming single image upload
    const [imagePreviews, setImagePreviews] = useState([]);

    const submit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!des || !tag) return; // Ensure description and tag are provided

        const formData = new FormData;
        formData.append('des', des);
        formData.append('tag', tag);
        formData.append('public', pubilc);
        if (imagePath) {
            formData.append('image', imagePath);
        }
        try {
            await setHow({formData}).unwrap();
            // Optionally reset the form fields
            setDes('');
            setTag('');
            setPublic(false);
            setImagePath([]);
            setImagePreviews([]);

            navigate('/welcome')
        } catch (err) {
            console.error(err);
        }
    };

    const onImageChange = e => {
        const files = Array.from(e.target.files);
        setImagePath(prevImages => [...prevImages, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
    };

    const removeImage = index => {
        setImagePath(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    return (
        <div className='page'>
            <Header/>
            <h2>Create Recommendation</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={des}
                        onChange={(e) => setDes(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Tag:</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Public:</label>
                    <input
                        type="checkbox"
                        checked={pubilc}
                        onChange={(e) => setPublic(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagePath(e.target.files[0])} // Assuming single file upload
                    />
                </div>
                <div>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
                                <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        padding: '2px 6px'
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Recommendation'}
                </button>
                {isError && <p>Error: {error.message}</p>}
                {data && <p>Recommendation created successfully!</p>}
            </form>
        </div>
    );
};

export default RecommendationCreate;
