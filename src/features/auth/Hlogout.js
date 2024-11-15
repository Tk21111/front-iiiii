import { useEffect, useState } from 'react';
import { useSendLogoutMutation } from './authApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './authSlice';

const LogOut = () => {
    const navigate = useNavigate()
    const [logout , setLogout] = useState(false);
    const [sendLogout, { data, isLoading, isSuccess, isError, error }] = useSendLogoutMutation();
    //req didn't get header ={username : user} so this fucking tthing is useless
    useEffect(() => {
        const fetchData = async () => {
            try {
              
                    localStorage.removeItem('login')
                    await sendLogout();

               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [ sendLogout]);

    useEffect(() => {
        setLogout(true)
    }, [sendLogout])

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (logout) {
        content = (
        <div className='page'>
            <section className="users">
                <h1>Users List</h1>
                <h1>Log out successfully</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        </div>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content;
};

export default LogOut;
