import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCreatePostMutation } from './PostApiSlice';
import { translate } from '../../hooks/translator';


const PostCreate = () => {
    const navigate = useNavigate();
    const [createPost, { data, isLoading, isError, error }] = useCreatePostMutation();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [imagePaths, setImagePaths] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { id } = useParams();

    const submit = async (e) => {
        e.preventDefault();

        if (!content || !title) return; // Check if required fields are empty

        const formDataPost = new FormData();
        formDataPost.append("content", content);
        formDataPost.append("title", title);

        if (id.startsWith('food=')) {
            formDataPost.append("food", id.split("=")[1]);
        } else if (id.startsWith('how=')){
            formDataPost.append("how", id.split("=")[1]);
        }

        imagePaths.forEach((file) => {
            formDataPost.append('images', file);
        });

        try {
            await createPost({ formDataPost }).unwrap();

            
            setContent('');
            setTitle('');
            setImagePaths([]);
            setImagePreviews([]);
            navigate('/post/false');
            
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

    const handleLinkWithFood = (e) => {
        e.preventDefault();
        navigate('/user/shopping/false/false/null/food=true');
    };
    const handleLinkWithHow = (e) => {
        e.preventDefault();
        navigate('/user/shopping/false/false/null/how=true');
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(URL.revokeObjectURL); // Cleanup object URLs when component unmounts
        };
    }, [imagePreviews]);

    return (
        <div className='page'>
            <Header />
            <div className="content">
        <img
          src={require("../../components/img/star.png")}
          alt="star"
          className="smalllogo"
        />
        <p style={{ marginRight: "auto" }} className="welcomefont">
          <Link to="/post/false/create/null" style={{textDecoration : 'none'}}>Create Post</Link>
        </p>
      </div>
            <form onSubmit={submit}>
            <label className='welcomefont'>{translate("title") + ':'}</label>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                    <label className='welcomefont' htmlFor="more">{translate("content")+ ":"}</label>
                    <textarea
                        id="more"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{fontSize : '100%'}}
                    ></textarea>
                <div>
                    <label className='welcomefont'>Images:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onImageChange}
                    />
                </div>
                <button disabled={isLoading} className='buttonCF' style={{border : '1px solid black' , fontSize : '90%', backgroundColor : '#FFF6A6' , color : '#F9AEFF' , margin : '1vi'}}type="button" onClick={handleLinkWithFood} >
                    <h2>{translate("linkFood")}</h2>
                </button>
                <button className='buttonCF' style={{border : '1px solid black' , fontSize : '90%' , backgroundColor : '#FFF6A6' , color : '#F9AEFF' , margin : '1vi'}} type="button" onClick={handleLinkWithHow} disabled={isLoading}>
                    <h2>{translate("linkRec")}</h2>
                </button>
                {id?.startsWith("food=") && <h2>Food Linked</h2>}
                {id?.startsWith("how=") && <h2>RECOMMEND Linked</h2>}

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

                <button type="submit" disabled={isLoading} className='buttonCF-save'>
                    {isLoading ? 'Creating...' : translate("save")}
                </button>

                {isError && <p>Error: {error.message}</p>}
                {data && <p>Recommendation created successfully!</p>}
            </form>
        </div>
    );
};

export default PostCreate;

