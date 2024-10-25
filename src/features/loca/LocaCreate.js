import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreatelocaMutation } from './LocaApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import Header from '../../components/Header';

const CreatePost = () => {
    const navigate = useNavigate();
    const { noteId, amount } = useParams();
    const username = useSelector(selectCurrentUser);

    const [createLoca, { isLoading }] = useCreatelocaMutation();


    const [more, setMore] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    
    const formRef = useRef(null);

    useEffect(() => {
        const loadScripts = () => {
            const script = document.createElement('script');
            script.src = 'https://api.longdo.com/map/?key=' + process.env.REACT_APP_API_KEY;
            script.async = true;
            script.onload = () => initializeMap();
            document.body.appendChild(script);

            const addressScript = document.createElement('script');
            addressScript.src = 'https://api.longdo.com/address-form/js/addressform.js';
            addressScript.async = true;
            document.body.appendChild(addressScript);

            return () => {
                document.body.removeChild(script);
                document.body.removeChild(addressScript);
            };
        };

        const initializeMap = () => {
            if (window.longdo) {
                formRef.current = new window.longdo.AddressForm('form_div', {
                    map: 'map_div',
                    showLabels: false,
                    debugDiv: 'debugoutput'
                });
            }
        };


        loadScripts();
    }, []);

    if (isLoading) return <p>Loading...</p>;


    const onMoreChange = e => setMore(e.target.value);

    const onImageChange = e => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
    };

    const removeImage = index => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

   

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formRef.current) {
          const formData = formRef.current.getFormJSON();
          console.log('Form Data:', formData);
        }
      };
    
    
    const onSavePostClicked = async () => {
        if (formRef.current.getFormJSON() != 'Invalid form data' ) {
            try {
                
                const formData = new FormData
            
                //from base data we already have
                formData.append("food", noteId)
                formData.append("username", username)
                formData.append("num", amount)
                images.forEach((image) => {
                    formData.append("images", image);
                });

                //from form provide by api
                const Tmp = formRef.current.getFormJSON()

                formData.append("country" , Tmp.country)
                formData.append("district" , Tmp.district)
                formData.append("subdistrict" , Tmp.subdistrict)
                formData.append("province" , Tmp.province)
                formData.append("more" , Tmp.etc + more)
                formData.append("latitude" , Tmp.latitude)
                formData.append("longitude" , Tmp.longitude)


                await createLoca({ formData }).unwrap();

                setMore('');
                setImages([]);
                setImagePreviews([]);

                navigate(`/location`);

            } catch (err) {
                console.error('Failed to save the post', err);
            }
        }
    };

    return (
        <div className='page'>
            <Header/>
            <section>
                <h2>Create Post</h2>
                <h1>{`Amount : ${amount}`}</h1>
                <form>
                    <label htmlFor="locaMore">More info:</label>
                    <input type="text" id="locamore" name="locamore" value={more} onChange={onMoreChange} />

                    <label htmlFor="locaImages">Upload Images:</label>
                    <input type="file" id="locaImages" name="locaImages" onChange={onImageChange} multiple />
                    <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        Submit
      </button>
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

                    <button type="button" onClick={onSavePostClicked}>
                        Save Post
                    </button>
                </form>

                {/* Address Form and Map Integration */}
                <div style={{ display: 'inline-block', verticalAlign: 'top', marginTop: '1rem' }}>
                    <div id="form_div" style={{ width: '320px', border: 'solid 2px' }}>Loading...</div>
                    <div id="debugoutput" style={{ maxWidth: '18rem', backgroundColor: '#fff39c', padding: '0.5rem', borderRadius: '6px', verticalAlign: 'top', marginTop: '1rem' }}>
                        ลองกรอกข้อมูลในฟอร์ม หรือลากหมุดบนแผนที่
                    </div>
                </div>

                {/* Map div */}
                <div id="map_div" style={{ width: '350px', height: '350px', display: 'inline-block' }}></div>
            </section>
        </div>
    );
};

export default CreatePost;
