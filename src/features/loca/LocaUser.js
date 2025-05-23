import { useEffect, useState } from 'react';
import { useGetAllUserlocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/comp/Search';

import { Link } from 'react-router-dom';
import Header from '../../components/Header';

const GetAlluserLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAllUserlocaQuery(('loca', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));

    const [page, setPage] = useState(0);
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
    let lContent;

    if (loading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {

        //this is what u have to modifine
        //user = { ids , entities}
        content = []
        if (users.ids.length !== 0 && !search) {
            
            for (let i of users.ids) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} own={true}/>);
            }
            console.log(content)
            //content = users.ids.map(postId => <LocasExcerpt key={postId} postId={postId} />)
        } else if (search) {
            for (let i of Object.keys(filterEntitiesByTag(users.entities, search, searchType))) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} own={true}/>);
            }
            console.log(content);
        }

        lContent = content.length / 24
    content = content.length > 0 ? content?.slice(24 * page, 24 * (page + 1)) :  null    } else if (isError) {
        let msg;
        if (error.status === 400) {
            msg = "No Food to recive or give";
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
        <div className='page'>
            <Header/>
            <div className='content' >
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/location/ofuser" >Food - Sharing</Link></p>
            </div>
            {/* search comp */}
            <div className="search">
                <img src={require('../../components/img/search.png')} alt="icon" style={{ marginLeft: '8px' }} />
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search..." 
                />
            </div>
            <div>
                <select
                        className="selection"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="food.text">Text</option>
                        <option value="district">District</option>
                        <option value="subdistrict">Subdistrict </option>
                        <option value="province">Province </option>
                        <option value="food.tag">tag </option>
                        <option value="num">num </option>
                        <option value="getPId.username">username</option>
                        <option value="getPId.aka">aka</option>
                    </select>
            </div>
            {/* end search comp */}
            <div className='user-list-parent'>{content}</div>
            <div className="page-control">
                <button onClick={() => setPage(page - 1)}  disabled={page === 0} >
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1 > lContent }>
                    {">"}
                </button>
            </div>
        </div>
    );
};


export default GetAlluserLoca;
