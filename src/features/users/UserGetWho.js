import { useEffect, useState, useRef } from 'react';
import { useGetWhoMutation } from './usersApiSlice';
import WhoReU from './UserNoToName';
import { Link } from 'react-router-dom';

const UsergetWho = () => {
    const user = 'gvbhnj';

    const [getWho, { data: users, isLoading, isError, error }] = useGetWhoMutation();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const userRef = useRef();
    const [userMsg, setUserMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    await getWho(user);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user, getWho]);

    useEffect(() => {
        if (error?.originalStatus === 404) {
            setErrMsg('Not found, contact me');
        } else if (isError) {
            setErrMsg('An error occurred');
            setUserMsg('joking it not now!!')
        } else if (users) {
            const result = WhoReU(users.no)
            setUserMsg(`Your giver is ${users.username} with a number of ${users.no} which is name ${result}`);
        }
    }, [error, isError, users]); //should be in useeffect to prevent re-loading

    let content;
    content = isLoading ? <p>Loading...</p> : (
        <section className="users">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>It's time!!!</h1>
            <h2 ref={userRef} className={userMsg ? "usermsg" : "offscreen"} aria-live="assertive" >{userMsg}</h2>
            <Link to="/welcome">Back to Welcome</Link>
        </section>
    );

    return content;
};

export default UsergetWho;
