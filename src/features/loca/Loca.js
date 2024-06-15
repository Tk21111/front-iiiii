import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';

import { Link } from 'react-router-dom';

const GetAllLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAlllocaQuery();
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setLoading(false);
        }
    }, [isLoading]);

    const handleRefresh = () => {
        setLoading(true);
        setRefresh(prev => prev + 1); // This will trigger a re-fetch
    };
    
    let content;

    if (loading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        console.log(users);
        content = users.ids.map(postId => <LocasExcerpt key={postId} postId={postId} />)
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
        } else {
            msg = JSON.stringify(error);
        }
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    }

    return content;
};


export default GetAllLoca;
