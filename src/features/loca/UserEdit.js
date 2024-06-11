import { useEffect, useState } from 'react';
import { useCreatelocaMutation } from './LocaApiSlice';
import { Link } from 'react-router-dom';
import { create } from '../../../../backend/model/Loca';

const Usercheck = () => {
    const [createloca, { data: users, isLoading , isError, error }] = useCreatelocaMutation();
    const [msg, setMsg] = useState('');
    const [town, setTown] = useState('');
    const [subdistrict, setSubdistrict] = useState('');
    const [county, setCounty] = useState('');
    const [more, setMore] = useState('');

    useEffect(() => {
        setMsg('');
    }, [town , subdistrict , county , more]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //temporaiy
            try {
                await createloca({ town , subdistrict , county , more }).unwrap();
                setPwd('');
                setMsg('Success');
            } catch (err) {
                if (!err?.originalStatus) {
                    setMsg('No Server Response');
                } else if (err.originalStatus === 400) {
                    setMsg('Missing Username or Password');
                } else if (err.originalStatus === 401) {
                    setMsg('Unauthorized => Dont have permission');
                } else {
                    setMsg('Failed');
                }
            }
        
    };

    const handleTownInput = (e) => setTown(e.target.value);
    const handleSubdistrictInput = (e) => setSubdistrict(e.target.value);
    const handleCountryInput = (e) => setCounty(e.target.value);
    const handleMoreInput = (e) => setMore(e.target.value);

    let content;
    
    content = isLoading ? <p>Loading...</p> : (
            <section className="users">
                <p className={msg ? "done" : "offscreen"} aria-live="assertive">{msg}</p>
                <h1>Given permission to see</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="pwd">Password:</label>
                    <input
                        type="text"
                        id="town"
                        value={town}
                        onChange={handleTownInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">Password:</label>
                    <input
                        type="text"
                        id="subdistrict"
                        value={subdistrict}
                        onChange={handleSubdistrictInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">Password:</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={handleCountryInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">Password:</label>
                    <input
                        type="text"
                        id="more"
                        value={more}
                        onChange={handleMoreInput}
                        autoComplete="off"
                    />
                    <button>Confirm</button>
                </form>
                <h1>{JSON.stringify(users)}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    
    

    return content;
}

export default Usercheck;
