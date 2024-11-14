import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import LocasExcerpt from './LocaExcerpt';
import filterEntitiesByTag from '../users/comp/Search';

import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Overay from '../../components/Overlay';
import { useGetUserMutation } from '../users/NoteApiSlice';
import LocasExcerptOrg from './LocaExcerptOrg';

const GetOrgSingle = () => {
    const [getUser , { data: user, isLoading, isSuccess, isError, error }] = useGetUserMutation();

    const {id} = useParams();
    const navigate = useNavigate();

    const [succes , setSuccess] = useState(false);
    const [succesMap , setSuccessMap] = useState(false);
    const mapRef = useRef(null);
    const scriptLoaded = useRef(false);

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

    useEffect(() => {
        const loadScripts = () => {
            //if loca isn't here just wait
            if (scriptLoaded.current || succesMap || !user) return; // Check if the script has already been loaded

            setSuccessMap(true)
            const script = document.createElement('script');
            script.src = 'https://api.longdo.com/map/?key=' + process.env.REACT_APP_API_KEY; // Replace with your API key
            script.async = true;
            script.onload = () => {
                scriptLoaded.current = true; // Mark script as loaded
                console.log('Longdo API loaded:', window.longdo);
                initializeMap();
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        };

        const initializeMap = () => {
            if (mapRef.current) {
                const map = new window.longdo.Map({
                    placeholder: mapRef.current,
                });
                addMarker(map);
            }
        };

        const addMarker = (map) => {
    
            if (user.latitude && user.longitude && !succes) {
                setSuccess(true)
                const marker = new window.longdo.Marker({
                    lon: user.longitude,
                    lat: user.latitude,
                });
                map.Overlays.add(marker);
            } else {
                console.error('Latitude and longitude are not defined for the marker.');
            }
        };

        loadScripts();
    }, [user ]); // Run when `loca` updates

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
                <button onClickCapture={() => {navigate(`/user/shopping/true/true/${user?.username}/food`)}} className="oforg-button">
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
