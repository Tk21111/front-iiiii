import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useGetAlllocaQuery , useDeletelocaMutation } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const LocasExcerpt = ({ postId: locaId }) => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetAlllocaQuery();
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');

    const [ deleteLoca , {isLoading : isDeleting}] = useDeletelocaMutation();

    useEffect(() => {
        if (data && data.entities) {
            const loca = data.entities[locaId];
            setLoca(loca);
            if (loca) {
                setText(loca.text);
            } else {
                setText('Have been deleted');
            }
        }
    }, [data, locaId]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isDeleting) {
        return <p> deleting</p>
    }
    if (!loca) {
        return <p>Location not found</p>;
    }


    return (
        <article>
            <h2>{text}</h2>
            <p>{loca.town}</p>
            <p className="postCredit">
                <Link to={`${loca.id}`}>View Post</Link>
                <Link to={`/user/note/create`}>Create</Link>
            </p>
        </article>
    );
};

export default LocasExcerpt;
