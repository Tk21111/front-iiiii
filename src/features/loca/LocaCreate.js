import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreatelocaMutation } from './LocaApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

const CreatePost = () => {
    const navigate = useNavigate()
    const { noteId , amount } = useParams();
    
    const username = useSelector(selectCurrentUser);

    const [createLoca, { isLoading }] = useCreatelocaMutation()
    const [town, setTown] = useState('')
    const [subdistrict, setSubdistrict] = useState('')
    const [county, setCounty] = useState('')
    const [more, setMore] = useState('')
    const [images, setImages] = useState([])  // Array to hold multiple images
    const [imagePreviews, setImagePreviews] = useState([]);  // Array to hold image preview URLs

    if (isLoading) return <p>Loading...</p>

    const onTownChange = e => setTown(e.target.value)
    const onSubdistrictChange = e => setSubdistrict(e.target.value)
    const onCountyChange = e => setCounty(e.target.value)
    const onMoreChange = e => setMore(e.target.value)
    
    const onImageChange = e => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]);

        // Generate previews
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
    }

    const removeImage = index => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    }

    const canSave = [town, subdistrict, county, noteId , amount].every(Boolean)

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                const formData = new FormData();

                formData.append("food", noteId)
                formData.append("username", username)
                formData.append("town", town)
                formData.append("subdistrict", subdistrict)
                formData.append("county", county)
                formData.append("more", more)
                formData.append("num", amount)
                
                images.forEach((image, index) => {
                    formData.append(`images`, image)
                });

                await createLoca({formData}).unwrap()
                setTown('');
                setSubdistrict('');
                setCounty('');
                setMore('');
                setImages([]);
                setImagePreviews([]);
                navigate(`/location`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    return (
        <div className='page'>
            <Header/>
            <section>
                <h2>Create Post</h2>
                <h1>{"Amount : " + amount}</h1>
                <form>
                    <label htmlFor="locaTown">Town:</label>
                    <input
                        type="text"
                        id="locaTown"
                        name="locaTown"
                        value={town}
                        onChange={onTownChange}
                    />
                    <label htmlFor="locaSubdistrict">Subdistrict:</label>
                    <input
                        type="text"
                        id="locasubdistrict"
                        name="locasubdistrict"
                        value={subdistrict}
                        onChange={onSubdistrictChange}
                    />
                    <label htmlFor="locaCountry">County:</label>
                    <input
                        type="text"
                        id="locacountry"
                        name="locacountry"
                        value={county}
                        onChange={onCountyChange}
                    />
                    <label htmlFor="locaMore">More info:</label>
                    <input
                        type="text"
                        id="locamore"
                        name="locamore"
                        value={more}
                        onChange={onMoreChange}
                    />
                    <label htmlFor="locaImages">Upload Images:</label>
                    <input
                        type="file"
                        id="locaImages"
                        name="locaImages"
                        onChange={onImageChange}
                        multiple  // Allow multiple file selection
                    />
                    
                    <div>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} style={{ display: 'inline-block', margin: '10px', position: 'relative' }}>
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
                                        padding: '2px 6px'
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onSavePostClicked}
                        disabled={!canSave}
                    >
                        Save Post
                    </button>
                </form>
            </section>
        </div>
    )
}

export default CreatePost
