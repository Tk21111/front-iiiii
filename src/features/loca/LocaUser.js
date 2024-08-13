import { useEffect, useState } from 'react';
import { useGetAllUserlocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/Search';

import { Link } from 'react-router-dom';

const GetAlluserLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAllUserlocaQuery(('loca', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('text');

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
        //user = { ids , entities}
        content = []
        if (users.ids.length !== 0 && !search) {
            
            for (let i of users.ids) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} />);
            }
            console.log(content)
            //content = users.ids.map(postId => <LocasExcerpt key={postId} postId={postId} />)
        } else if (search) {
            for (let i of Object.keys(filterEntitiesByTag(users.entities, search, searchType))) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} />);
            }
            console.log(content);
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

    return (
        <div>
            <p><Link to="/welcome"> Home </Link></p>
            <div>
                <label>
                    Search Query:
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                <label>
                    Search Type:
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="town">Town</option>
                        <option value="subdistrict">Subdistrict </option>
                        <option value="county">County </option>
                        <option value="tag">tag </option>
                        <option value="getP"> geter person </option>
                        <option value="count"> how many </option>
                        <option value="exp"> exp </option>
                    </select>
                </label>
            </div>
            {content}
        </div>
    );
};


export default GetAlluserLoca;
