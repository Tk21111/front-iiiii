import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'

import { Link } from 'react-router-dom';
import list from './menu';

const GetAllNoteUser = () => {
    const user = { "username" : useSelector(selectCurrentUser)};
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    console.log(user)
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
        //this is what u have to modifine

        /* what the fuck is this stupid compare list in list 
        console.log(list)
        console.log(users);
        const { ids , entities } = users
        let list1 = []
        let list2 = []
        for (let i of ids) {
            list1.push(entities[i].tag)
        };

        for (let f of list){
            list2.push(f.tag)
        };
        if (list1.length !== list2.length) {
            return false;
        }
    
        function checkListsEquality(list1, list2) {
            if (list1.length !== list2.length) {
                return false;
            }
        
            for (let i = 0; i < list1.length; i++) {
                if (Array.isArray(list1[i]) && Array.isArray(list2[i])) {
                    if (list1[i].length !== list2[i].length) {
                        return false;
                    }
                    for (let j = 0; j < list1[i].length; j++) {
                        if (list1[i][j] !== list2[i][j]) {
                            return false;
                        }
                    }
                } else if (list1[i] !== list2[i]) {
                    return false;
                }
            }
        
            return true;
        }

        console.log(checkListsEquality(list1,list2))

        
        const result = listO.map(role => list1.includes(role)).find(val => val === true);
        console.log(result)*/
        const jsonString = JSON.stringify(list)
        content = (
            <section className="users">
                <h1>Your giver is</h1>
                <h2> {jsonString} </h2>
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

/*
<ul>
                    {users.map((user, i) => (
                        <li key={i}>{`Food : ${user.text}  have : ${user.count}  is expired :  ${user.done}  timeout : ${user.timeOut? user.timeOut : "undefined"}  tag : ${user.tag ? user.tag : 'undefined'}`}</li>
                    ))}
                </ul>*/