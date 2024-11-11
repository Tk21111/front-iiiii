import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverlayCenter from '../../components/OverlayCenter';
import filterEntitiesByTag from '../users/comp/Search';
import { useSetLikeMutation } from './PostApiSlice';

const PostsExcerpt = ({ i }) => {
    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);
    const { user } = useParams();

    const [setLike] = useSetLikeMutation();

    const updateLike = async (like) => {
        await setLike({ id: {[i._id] : like} }).unwrap();
    };

    // Filter out private conversation posts
    if (i?.userlist?.length > 0) {
        if (!i?.userlist.includes(username)) {
            return null;
        }
    }
    if (i?.userlist?.length === 0 && user === 'true') {
        return null;
    }
    // Filter out reply comments
    if (i?.reply) {
        return null;
    }

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
                        </div>
                        <Link className="post-link" to={`/post/false/${i?.id || i?._id}`}>to single</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsExcerpt;
