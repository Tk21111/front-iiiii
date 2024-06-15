import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAlllocaQuery } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const LocasExcerpt = ({ postId: locaId }) => {

    const { data, isLoading } = useGetAlllocaQuery();
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');

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

    if (!loca) {
        return <p>Location not found</p>;
    }

    return (
        <article>
            <h2>{text}</h2>
            <p>{loca.town}</p>
            <p className="postCredit">
                <Link to={`${loca.id}`}>View Post</Link>
                <Link to={`create`}>Create</Link>
            </p>
        </article>
    );
};

export default LocasExcerpt;
