import { useEffect, useState } from 'react';
import { useCreatelocaMutation } from './LocaApiSlice';
import { Link } from 'react-router-dom';

const LocaCreate = () => {
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
        if (town || subdistrict || county ){
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
        }
    };

    const handleTownInput = (e) => setTown(e.target.value);
    const handleSubdistrictInput = (e) => setSubdistrict(e.target.value);
    const handleCountyInput = (e) => setCounty(e.target.value);
    const handleMoreInput = (e) => setMore(e.target.value);

    let content;
    
    content = isLoading ? <p>Loading...</p> : (
            <section className="users">
                <p className={msg ? "done" : "offscreen"} aria-live="assertive">{msg}</p>
                <h1>Given permission to see</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="pwd">town:</label>
                    <input
                        type="text"
                        id="town"
                        value={town}
                        onChange={handleTownInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">subdistrict:</label>
                    <input
                        type="text"
                        id="subdistrict"
                        value={subdistrict}
                        onChange={handleSubdistrictInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">county:</label>
                    <input
                        type="text"
                        id="county"
                        value={county}
                        onChange={handleCountyInput}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="pwd">more:</label>
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

export default LocaCreate;
