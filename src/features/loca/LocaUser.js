import { useEffect, useState } from 'react';
import { useGetAllUserlocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/Search';

import { Link } from 'react-router-dom';

const GetAlluserLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAllUserlocaQuery();
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
        const serch = null
        const type = 'text'

        //this is what u have to modifine
        //user = { ids , entities}
        console.log(users)
        if(users?.ids?.length !== 0 && !serch ){
            content = users.ids.map(postId => <LocasExcerpt key={postId} postId={postId} />)
        } else if (users?.ids?.length !== 0 && serch) {
            const f = filterEntitiesByTag(users.entities , serch , type)
            const key = Object.keys(f)
            content = key.map(postId => <LocasExcerpt key={postId} postId={postId} />)
        }
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


export default GetAlluserLoca;
