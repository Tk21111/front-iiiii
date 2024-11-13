import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverlayCenter from '../../components/OverlayCenter';
import filterEntitiesByTag from '../users/comp/Search';
import { useSavePostMutation, useSetLikeMutation } from './PostApiSlice';

const PostsExcerpt = ({ i }) => {

    const username = useSelector(selectCurrentUser);

    const [setLike] = useSetLikeMutation();
    const [savePost , {isSucess : saved}] = useSavePostMutation();

    const updateLike = async (like) => {
        await setLike({ id: {[i._id] : like} }).unwrap();
    };

    const handleSave = async () => {
        try {
          await savePost({id : i._id}).unwrap();
          // Optionally, navigate back to the post list or show a confirmation message
          
            alert("saved")
          
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      };
    


    if (!i) {
        return <p>Location not found</p>;
    }

    const imagePath = i?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
    const imageUserPath = i?.user?.image?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    return (
        <div className="food-waste-item">
            <div className="food-waste-front">
                <img
                    src={imageUserPath ? imageUserPath[0] : require('../../components/img/home.png')}
                    alt="user icon"
                    className="smalllogolist"
                />
                <h2 className="user-aka">{i?.user.aka}</h2>
            </div>
            <div className="overcontent">
                <div className="food-waste-content">
                    <div className="food-waste-details">
                        <h2>{i?.title}</h2>
                        <p>{i?.content}</p>
                        <h2>{(i?.like?.length || 0) - (i?.unlike?.length || 0)}</h2>
                        <div>
                            <button onClickCapture={() => updateLike(true)}>like</button>
                            <button onClickCapture={() => updateLike(false)}>unlike</button>
                            <button onClickCapture={() => handleSave()}>save</button>
                        </div>
                        <Link className="post-link" to={`/post/false/${i?.id || i?._id}`}>to single</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsExcerpt;
