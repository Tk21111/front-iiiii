import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useCreatePostMutation } from './PostApiSlice';


const PostCreate = () => {
    const navigate = useNavigate();
    const [createPost, { data, isLoading, isError, error }] = useCreatePostMutation();
    const [content, setContent] = useState('');
    const [imagePaths, setImagePaths] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const submit = async (e) => {
        e.preventDefault();
    
        if (!content) return;
    
        const formData = new FormData();
        formData.append("content", content);
        formData.append("wtf", "content");
    
        imagePaths.forEach((file) => {
            formData.append('images', file);
        });
    
        console.log("FormData submitted:", formData);
    
        try {
            await createPost({ formData }).unwrap();
            setContent('');
            setImagePaths([]);
            setImagePreviews([]);
            navigate('/post');
        } catch (err) {
            console.error(err);
            alert('Error: Unable to create post. Please try again.');
        }
    };
    

    const onImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5000000); // 5MB size limit

        setImagePaths(prevImages => [...prevImages, ...validFiles]);

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImagePaths(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => {
            URL.revokeObjectURL(prevPreviews[index]); // Cleanup the preview URL
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(URL.revokeObjectURL); // Cleanup object URLs when component unmounts
        };
    }, [imagePreviews]);

    return (
        <div className='page'>
            <Header />
            <h2>Create Recommendation</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Content:</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Images:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onImageChange}
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
                                    padding: '2px 6px',
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Post'}
                </button>

                {isError && <p>Error: {error.message}</p>}
                {data && <p>Recommendation created successfully!</p>}
            </form>
        </div>
    );
};

export default PostCreate;
