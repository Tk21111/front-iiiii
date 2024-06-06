import { useEffect , useState , useRef} from 'react';
import { useGetRandnumMutation } from './usersApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import WhoReU from './UserNoToName';

const UserO = () => {
    const user = 'gvbhnj'
    const [getRandnum, { data: users, isLoading, isSuccess, isError, error }] = useGetRandnumMutation()
    const userRef = useRef();
    const [userMsg, setuserMsg] = useState('');
    //req didn't get header ={username : user} so this fucking tthing is useless
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    await getRandnum(user);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user, getRandnum]);
    useEffect(() => {
        if (error?.status === 409) {
            setuserMsg('Already have random number');
        } else if (isError) {
            setuserMsg('An error occurred');
        } else if (users) {
            const result = WhoReU(users.no)
            setuserMsg(`Your giver is ${users.username} with a number of ${users.no} which is name ${result}`);
        }
    }, [error, isError, users]); //should be in useeffect to prevent re-loading
    
    let content;

    
    content = isLoading? <p>Loading...</p> : content = (
        <section>
                <h> u have to give toooooo!!!</h>
                <h2 ref={userRef} className={userMsg ? "usermsg" : "offscreen"} aria-live="assertive" >{userMsg}</h2>
                <Link to="/welcome">Back to Welcome</Link>
        </section>  
        );
    
    if (isError) {
        content = (
            <section className='users'>
                <h2 ref={userRef} className={userMsg ? "usermsg" : "offscreen"} aria-live="assertive" >{userMsg}</h2>
                <Link to='/user'> Your random rumber</Link>
                <Link to="/welcome">Back to Welcome</Link>
            </section>  
    )
    }

    return content;
};

export default UserO;
