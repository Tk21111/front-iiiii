import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/comp/Search';

import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Overay from '../../components/Overlay';

const GetAllLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAlllocaQuery(('locaUser', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('food.text');

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

        //this is what u have to modifine
        //user = { ids , entities}
        content = []
        if (users.ids.length !== 0 && !search) {
            
            for (let i of users.ids) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} own={false} />);
            }
            
        } else if (search) {
            for (let i of Object.keys(filterEntitiesByTag(users.entities, search, searchType , false))) {
                content.push(<LocasExcerpt key={i} i={users.entities[i]} own={false} />);
            }
            
        }

        lContent = content.length / 24
    content = content.length > 0 ? content?.slice(24 * page, 24 * (page + 1)) :  null
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
        <div className='page'>
            <Header />
            <Overay link={"user/shopping/true/false/null/food"} />
            <div className='content' >
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/location" >Food - Sharing</Link></p>
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
                        <option value="user.username">username </option>
                        <option value="user.aka">aka </option>
                    </select>
            </div>
            {/* end search comp */}
            <div className='user-list-parent'>{content}</div> 
            <div className="page-control">
                <button onClick={() => setPage(page - 1)}  disabled={page === 0} >
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1> lContent }>
                    {">"}
                </button>
            </div>
        </div>
    );
}


export default GetAllLoca;

/*<div>
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
                        <option value="text">Text</option>
                        <option value="town">Town</option>
                        <option value="subdistrict">Subdistrict </option>
                        <option value="county">County </option>
                        <option value="tag">tag </option>
                        <option value="count">count </option>
                        <option value="exp">exp </option>
                    </select>
                </label>
            </div>*/