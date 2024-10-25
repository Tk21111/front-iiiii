import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import Header from '../../components/Header';

const SingleLocaPage = () => {
    const locaId = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAlllocaQuery();
    
    const [loca, setLoca] = useState('');
    const [text, setText] = useState('');
    const mapRef = useRef(null);
    const scriptLoaded = useRef(false); // Ref to check if the script has been loaded

    useEffect(() => {
        const loadScripts = () => {
            if (scriptLoaded.current) return; // Check if the script has already been loaded

            const script = document.createElement('script');
            script.src = 'https://api.longdo.com/map/?key=adc1eb3709942261fff256fec52bbe56'; // Replace with your API key
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
            console.log(loca.longitude)
            if (loca.latitude && loca.longitude) {
                const marker = new window.longdo.Marker({
                    lon: loca.longitude,
                    lat: loca.latitude,
                });
                map.Overlays.add(marker);
            } else {
                console.error('Latitude and longitude are not defined for the marker.');
            }
        };

        loadScripts();
    }, [loca]); // Run when `loca` updates

    useEffect(() => {
        if (data && data.entities) {
            const locaData = data.entities[locaId.noteId];
            setLoca(locaData || {}); // Safely set loca to an empty object if undefined
            setText(locaData ? locaData.text : 'Have been deleted');
        }
    }, [data, locaId]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Can't find location sharing post</p>;

    const imagePath = loca?.images?.map(p => `${process.env.REACT_APP_API}/${p.replace(/\\/g, '/')}`) || [];
    
    return (
        <div className='page'>
            <Header/>
            <div id="map" ref={mapRef} className='map'></div>
            <h2>{text}</h2>
            <h1>{loca?.organisation ? "Organisation!" : "User"}</h1>
            <p>District: {loca?.district}</p>
            <p>Subdistrict: {loca?.subdistrict}</p>
            <p>Country: {loca?.country}</p>
            <p>More: {loca?.more ? loca.more : "Don't have more"}</p>
            {(loca?.user)? <Link to={`/getuser/${loca.user}`}>that person</Link> : null}
            {imagePath.map((path, i) => (
                <img key={i} src={path} alt={`note image ${i}`} style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }} />
            ))}
        </div>
    );
};

export default SingleLocaPage;
