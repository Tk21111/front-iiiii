import { useEffect } from 'react';
import { useCheckDullMutation } from './usersApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const Usercheck = () => {
    const user = 'gvbhnj';
    const [checkDull, { data: users, isLoading, isSuccess, isError, error }] = useCheckDullMutation()
    //req didn't get header ={username : user} so this fucking tthing is useless
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    await checkDull(user);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user, checkDull]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        content = (
            <section className="users">
                <h1>Cheke for Dupilcate pls don't have one</h1>
                <h1>{JSON.stringify(users)}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    } else if (isError) {
        let msg 
        if (error.originalStatus === 401) { msg = "You dont have permission"} else { msg = JSON.stringify(error)};
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>  
    )
    }

    return content;
};

export default Usercheck;
