import { useEffect, useState } from 'react';
import { useAdminGiveMutation } from './usersApiSlice';
import { Link } from 'react-router-dom';

const Usercheck = () => {
    const [adminGive, { data: users, isLoading , isError, error }] = useAdminGiveMutation();
    const [msg, setMsg] = useState('');
    const [pwd, setPwd] = useState('');

    useEffect(() => {
        setMsg('');
    }, [pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pwd === 'guhijo') {
            try {
                console.log(pwd)
                await adminGive({ pwd }).unwrap();
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
        } else {
            setMsg('Incorrect password');
        }
    };

    const handlePwdInput = (e) => setPwd(e.target.value);

    let content;
    
    content = isLoading ? <p>Loading...</p> : (
            <section className="users">
                <p className={msg ? "done" : "offscreen"} aria-live="assertive">{msg}</p>
                <h1>Given permission to see</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="pwd">Password:</label>
                    <input
                        type="password"
                        id="pwd"
                        value={pwd}
                        onChange={handlePwdInput}
                        autoComplete="off"
                        required
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
