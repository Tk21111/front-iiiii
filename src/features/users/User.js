import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import { Link } from 'react-router-dom';

const GetAllNoteUser = () => {
    const user = { "username": "2311115a5aaaaawa" };
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        console.log(users);
        content = (
            <section className="users">
                <h1>Your giver is</h1>
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>{`Food : ${user.text}  have : ${user.count}  is expired :  ${user.done} timeout : ${user.timeOut? user.timeOut : "undefined"}tag : ${user.tag ? user.tag : 'undefined'}`}</li>
                    ))}
                </ul>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
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

    return content;
};

export default GetAllNoteUser;
