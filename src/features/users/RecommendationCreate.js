import React, { useState } from 'react';
import { useSetHowMutation } from './NoteApiSlice';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const RecommendationCreate = () => {
    const navigate = useNavigate();
    const [setHow, { data, isLoading, isError, error }] = useSetHowMutation();
    
    const [des, setDes] = useState('');
    const [food, setFood] = useState('');
    const [tag, setTag] = useState('');
    const [pubilc, setPublic] = useState(false);
    const [ingredent, setIngredent] = useState([{ "0": '', "1": null }]); // Array of ingredient objects
    const [imagePaths, setImagePaths] = useState([]); // For multiple images
    const [imagePreviews, setImagePreviews] = useState([]);

    const submit = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        if (!des || !tag || !food) return; // Ensure description and tag are provided
    
        const formData = new FormData();
        formData.append('food', food);
        formData.append('des', des);
        formData.append('tag', tag);
        formData.append('public', pubilc);
        formData.append('ingredent', (ingredent)); // Convert array to string for server
    
        // Append all selected images to FormData
        imagePaths.forEach((file) => {
            formData.append('images', file); // Change 'image' to 'images'
        });
    
        try {
            await setHow({formData}).unwrap();
            // Reset form fields after submission
            setDes('');
            setTag('');
            setFood('');
            setPublic(false);
            setIngredent([{ "0": '', "1": null }]); // Reset ingredients to initial state
            setImagePaths([]);
            setImagePreviews([]);
            navigate('/recommend');
        } catch (err) {
            console.error(err);
        }
    };
    

    const onImageChange = e => {
        const files = Array.from(e.target.files);
        setImagePaths(prevImages => [...prevImages, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
    };

    const removeImage = index => {
        setImagePaths(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, key, value) => {
        const updatedIngredients = ingredent.map((note, i) =>
            i === index ? { ...note, [key]: value } : note
        );
        setIngredent(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredent([...ingredent, { "0": '', "1": null }]);
    };

    const removeIngredient = (index) => {
        setIngredent(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className='page'>
            <Header />
            <h2>Create Recommendation</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Food:</label>
                    <input
                        type="text"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        required
                    />
                </div>
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
                {ingredent.map((_, index) => (
                    <div key={index}>
                        <label>Ingredient:</label>
                        <input
                            type="text"
                            value={ingredent[index]['0']}
                            onChange={(e) => handleInputChange(index, '0', e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            value={ingredent[index]['1']}
                            onChange={(e) => handleInputChange(index, '1', e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>Add Ingredient</button>
                
                <div>
                    <label>Public:</label>
                    <input
                        type="checkbox"
                        checked={pubilc}
                        onChange={(e) => setPublic(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Images:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple // Allow multiple files
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
