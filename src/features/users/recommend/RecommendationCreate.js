import React, { useState, useEffect } from 'react';
import { useSetHowMutation } from '../NoteApiSlice';
import Header from '../../../components/Header';
import { useNavigate } from 'react-router-dom';
import { translate } from '../../../hooks/translator';

const RecommendationCreate = () => {
    const navigate = useNavigate();
    const [setHow, { data, isLoading, isError, error }] = useSetHowMutation();

    const [des, setDes] = useState('');
    const [food, setFood] = useState('');
    const [tag, setTag] = useState('');
    const [pubilc, setPublic] = useState(false);
    const [ingredent, setIngredent] = useState([{ "0": '', "1": null, unit: '' }]);
    const [imagePaths, setImagePaths] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        return () => {
            // Cleanup previews on unmount
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const submit = async (e) => {
        e.preventDefault();
        if (!des || !tag || !food) return alert('All fields are required!');

        // Validate ingredients
        if (ingredent.some((item) => !item['0'] || item['1'] === null || !item.unit)) {
            alert('Please fill out all ingredient details.');
            return;
        }

        const formattedIngredients = ingredent.map(({ "0": name, "1": quantity, unit }) => ({
            name,
            quantity,
            unit,
        }));

        console.log(formattedIngredients)

        const formData = new FormData();
        formData.append('name', food);
        formData.append('des', des);
        formData.append('tag', tag);
        formData.append('public', pubilc);
        formData.append('ingredent', JSON.stringify(formattedIngredients));

        imagePaths.forEach((file) => formData.append('images', file));

        try {
            await setHow({ formData }).unwrap();
            
            setDes('');
            setTag('');
            setFood('');
            setPublic(false);
            setIngredent([{ "0": '', "1": null, unit: 'kg' }]);
            setImagePaths([]);
            setImagePreviews([]);
            navigate('/recommend');
            
        } catch (err) {
            console.error(err);
        }
    };

    const onImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagePaths((prevImages) => [...prevImages, ...files]);
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
    };

    const removeImage = (index) => {
        setImagePaths((prevImages) => prevImages.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => {
            URL.revokeObjectURL(prevPreviews[index]);
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    const handleInputChange = (index, key, value) => {
        const updatedIngredients = ingredent.map((note, i) =>
            i === index ? { ...note, [key]: value } : note
        );
        setIngredent(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredent([...ingredent, { "0": '', "1": null, unit: '' }]);
    };

    const removeIngredient = (index) => {
        setIngredent((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className='page'>
            <Header />
            <h2>Create Recommendation</h2>
            <form onSubmit={submit}>
                <div>
                    <label>{translate("foodName") + " :"}</label>
                    <input
                        type="text"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        required
                    />
                </div>
                <label>{translate("des") + " :"}</label>
                <div>
                    
                    <textarea
                        value={des}
                        onChange={(e) => setDes(e.target.value)}
                        required
                        style={{ height: '50vh', width: '100%' }}
                    />
                </div>
                <div>
                    <label>{translate("tag") + " :"}</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        required
                    />
                </div>
                <label>{translate("ingredient") + " :"}</label>
                {ingredent.map((_, index) => (
                    <div key={index}>
                        
                        <input
                            type="text"
                            value={ingredent[index]['0']}
                            onChange={(e) => handleInputChange(index, '0', e.target.value)}
                            placeholder='ชื่อวัตถุดิบ'
                            required
                            style={{width : '25vh'}}
                        />
                        <input
                            type="number"
                            value={ingredent[index]['1']}
                            onChange={(e) => handleInputChange(index, '1', e.target.value)}
                            placeholder='จำนวน'
                            style={{width : '25vh'}}

                            required
                        />
                        <select
                            value={ingredent[index].unit}
                            onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                            required
                            style={{height : "5vh"}}
                        >
                            <option value="kg">กิโลกรัม</option>
                            <option value="piece">ชิ้น</option>
                        </select>
                        <button type="button" onClick={() => removeIngredient(index)}>
                            {translate("delete")}
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>
                    {translate("more")}
                </button>
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
                        multiple
                        onChange={onImageChange}
                        disabled={true}
                    />
                </div>
                <div>
                    {imagePreviews.map((preview, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'inline-block',
                                margin: '10px',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={preview}
                                alt={`Preview ${index}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
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
                    {isLoading ? 'Creating...' : translate("save")}
                </button>
                {isError && error && (
                    <p style={{ color: 'red' }}>
                        {error.message || 'An unexpected error occurred.'}
                    </p>
                )}
                {data && <p>Recommendation created successfully!</p>}
            </form>
        </div>
    );
};

export default RecommendationCreate;
