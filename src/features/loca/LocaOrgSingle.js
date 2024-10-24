import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/Search';

import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Overay from '../../components/Overlay';
import { useGetUserMutation } from '../users/NoteApiSlice';
import LocasExcerptOrg from './LocaExcerptOrg';

const GetOrgSingle = () => {
    const [getUser , { data: user, isLoading, isSuccess, isError, error }] = useGetUserMutation();

    const {id} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [data , setData] = useState(null);

    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('text');

    useEffect(() => {
        if (!isLoading && !isSuccess) {
            getUser({userId : id}).unwrap();
            
        }
        
    }, [isLoading]);

    let content;

       
    if (loading) {
        content = <p>Loading...</p>;      
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

    console.log(user)
    const imagePath = user?.image?.map(p => { return `${process.env.REACT_APP_API}/${p.replace(/\\/g, '/')}`}) || [];

    return (
        <div className='page'>
            <Header/>
            <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user/shopping/false/false" > Food - Sharing </Link></p>
            </div>
            <div className='content' style={{flexDirection : 'column' }}>
                <img src={imagePath} alt="donate" ></img>
                <h2>{"Name : " + user?.aka}</h2>
                <h2>{"Address : " + user?.more}</h2>
                <h2>{"Details : " + user?.more}</h2>
            </div>
            <div className="oforg-button-container">
                <button onClickCapture={() => {navigate(`/user/shopping/true/true/${user?.username}`)}} className="oforg-button">
                    <h2>Donate</h2>
                </button>
            </div>

            
        </div>
    );
}


export default GetOrgSingle;

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